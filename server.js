var express = require('express');
var url = require('url');
var app = express();
var http = require('http');
var instagram = require('instagram-node').instagram();

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

instagram.use({

  client_id: 'f81f407862d44b03a130dfb1c020c5ff',
  client_secret: 'd337b5c6f52f4b3a8270d83c2d88ef18'

});

//app.get('/authorize_user', exports.authorize_user);

//app.get('/handleauth', exports.handleauth);
app.get('/', function(req, res) {
  var pathname=url.parse(req.url).pathname;
  console.log(pathname);
  switch(pathname){
    case'/dashboard':
                  ig.user_media_recent( function(err, medias, pagination, remaining, limit) {
                  res.render('public/pages/dashboard.ejs', {gram: medias });
                  });
                  break;
  case'/search':
          ig.user_media_recent( function(err, medias, pagination, remaining, limit) {
      res.render('public/pages/profile.ejs', {gram: medias });
      });
    break;
    case'/subpage':
            ig.user_media_recent( function(err, medias, pagination, remaining, limit) {
        res.render('public/pages/userpage.ejs', {gram: medias });
        });
      break;
    default:
            instagram.media_popular(function(err, medias, remaining, limit){
            res.render('public/pages/index.ejs', {gram: medias });
  });
  }
});

app.listen(8080, function(err){
  if(err){
    console.log("Error");
  }
  else{
    console.log("Listening");
  }

});
