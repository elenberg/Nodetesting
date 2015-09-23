var express = require('express');
var url = require('url');
var app = express();
var account = require('account');
var http = require('http');
var instagram = require('instagram-node').instagram();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

instagram.use({

  client_id: 'f81f407862d44b03a130dfb1c020c5ff',
  client_secret: 'd337b5c6f52f4b3a8270d83c2d88ef18'

});



var redirect_uri = 'http://209.95.48.196:8080/handleauth';

exports.authorize_user = function(req, res) {
  res.redirect(instagram.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  instagram.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      instagram.use({access_token: result.access_token});
      console.log('Yay lets use ' + instagram.user_id);
      instagram.user_media_recent(instagram.user_id, function(err, medias, pagination, remaining, limit) {
      res.render('public/pages/index.ejs', {gram: medias });
      });
    }
  });
};

// This is where you would initially send users to authorize
app.get('/', exports.authorize_user);
// This is your redirect URI
app.get('/handleauth', exports.handleauth);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//app.get('/authorize_user', exports.authorize_user);

//app.get('/handleauth', exports.handleauth);

/*
app.get('*', function(req, res) {
            var pathname = url.parse(req.url).hash;
            console.log(pathname);
            instagram.set('access_token', pathname);
            console.log(instagram.users.recent({user_id: ******}));
            instagram.media_popular(function(err, medias, remaining, limit){
            res.render('public/pages/index.ejs', {gram: medias });
  });

});
/*
app.get('/login', function(req, res) {

            instagram.media_popular(function(err, medias, remaining, limit){
            res.render('public/pages/index.ejs', {gram: medias });
  });

});


app.get('/dashboard', function(req, res) {

            instagram.media_popular(function(err, medias, remaining, limit){
            res.render('public/pages/index.ejs', {gram: medias });
  });

});


app.get('/search', function(req, res) {

            instagram.media_popular(function(err, medias, remaining, limit){
            res.render('public/pages/index.ejs', {gram: medias });
  });

});


app.get('/search', function(req, res) {

            instagram.media_popular(function(err, medias, remaining, limit){
            res.render('public/pages/index.ejs', {gram: medias });
  });

});

app.get('/?*', function(req, res) {

           var pathname = url.parse(req.url).query;
           console.log(pathname);
           instagram.media_popular(function(err, medias, remaining, limit){
           res.render('public/pages/index.ejs', {gram: medias });
           });
});
*/
/*
http.createServer(function (request, response) {
    // Parse the entire URI to get just the pathname
    var uri = url.parse(request.url).pathname, query;
        if (uri == "/account") //If it's mysite.com/account
        {
            request.setEncoding("utf8");
            request.content = '';
            ig.user_media_recent( function(err, medias, pagination, remaining, limit) {
            response.render('public/pages/userpage.ejs', {gram: medias });
            });

                        //call account.whatever() to route to your account     functionality
                        //send the response from it

        }
            else if (uri == "/") //It's mysite.com
            {
                instagram.media_popular(function(err, medias, remaining, limit){
                  response.render('public/pages/index.ejs', {gram: medias });
              });
            }
}).listen(8080, function(err){
  if(err){
    console.log("Error");
  }
  else{
    console.log("Listening");
  }

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
