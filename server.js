var express = require('express');
var url = require('url');
var app = express();
var http = require('http');
var instagram = require('instagram-node').instagram();
//var RedisStore = require('connect-redis')(express);
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

/*getting errors everytime I enabled RedisStore or Mongo-store. Not sure why.

app.use(session({
  store: new RedisStore({
    db: 'instagramapp',
    host: '127.0.0.1',
    port: 3365,
    prefix: 'sess'
  })
}));
*/

app.use(cookieParser());
app.use(session({
  secret: 'You know I don\'t like chocolate right?',
  cookie:{}
}))
instagram.use({

  client_id: 'f81f407862d44b03a130dfb1c020c5ff',
  client_secret: 'd337b5c6f52f4b3a8270d83c2d88ef18'

});

var redirect_uri = 'http://209.95.48.196:8080/handleauth';
var homepage_uri = 'http://209.95.48.196:8080/dashboard';

exports.authorize_user = function(req, res) {
  res.redirect(instagram.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  instagram.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token + ' And more information' + result.user.id);
      instagram.use({access_token: result.access_token});
      session.loggedIn = true;
      session['user_id'] = result.user.id;
      session['username'] = result.user.username;
      session['full_name'] = result.user.full_name;
      session['profile_picture'] = result.user.profile_picture;
      res.cookie('test', 'yes', { expires: new Date(Date.now() + 365*2*24*60*60*1000), httpOnly: true });
      console.log('Yay lets use ' + result.user.id);
      res.redirect(homepage_uri);
    }
  });
};

app.get('/', function(req, res) {
  if(req.session.loggedIn == true){
    console.log('Undefined isn\'t it?' + req.session.loggedIn + ' ');
    res.redirect(homepage_uri);
  }
  else{
    res.redirect(instagram.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
  }
});

app.get('/handleauth', exports.handleauth);

app.get('/dashboard', function(req, res){

  console.log('Session is?' + req.session.loggedIn + ' \n');
  if(req.session.loggedIn === true){//This always returns false. Trying to figure out why it isn't grabbing the session.

  instagram.user_media_recent(session.user_id, function(err, medias, pagination, remaining, limit) {
  res.render('public/pages/index.ejs', {gram: medias });
  });
  }
  else{
    console.log('In else statement of dashboard\n' + req.cookies.name + ' Including cookies. Testing.');
    //For some reason it isn't grabbing the instagram.use from line 27. Not sure why.
    instagram.use({

      client_id: 'f81f407862d44b03a130dfb1c020c5ff',
      client_secret: 'd337b5c6f52f4b3a8270d83c2d88ef18'

    });
    res.redirect(instagram.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
  }
});
/*
http.createServer(app).listen(app.get(8080), function(){
  console.log("Express server listening on port " + app.get(8080));
});
*/
app.listen(8080, function(err){
  if(err){
    console.log("Error");
  }
  else{
    console.log("Listening");
  }

});

