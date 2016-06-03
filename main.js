var express = require('express'),
  app = express(),
  httpServer = require('http').Server(app),
  io = require('socket.io')(httpServer),
  Server = require('./lib/server'),
  fs = require('fs'),
  vendors = require('./vendors'),
  routes = require('./lib/http/routes'),
  auth = require('./lib/http/auth'),
  oauth = require('oauth');
var Twit = require('twit');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

httpServer.listen(3000);

app.use(express.static('static'));

app.get('/user', auth, routes.user);
app.post('/user/add', routes.addUser);
//app.get('/user/settings/:user')
app.get('/profile', auth, routes.getUserInfo);
//app.get('/user/:id', routes.getUserStream);

//Social Networks Login stuff
app.get('/auth/tumblr/request', auth, routes.tumblrRequest);
app.get('/auth/tumblr/callback', routes.tumblrCallback);
app.get('/auth/facebook/request', auth, routes.facebookRequest);
app.get('/auth/facebook/callback', routes.facebookCallback);
app.get('/auth/twitter/request', auth, routes.twitterRequest);
app.get('/auth/twitter/callback', routes.twitterCallback);

app.get('/auth/github/request', auth, routes.githubRequest);
app.get('/auth/github/callback', routes.githubCallback);

//User data from all social network
app.get('/posts/:user', routes.posts);
//User data from each social network
app.get('/facebook/:user', auth, routes.postsFacebook);
app.get('/tumblr/:user', auth, routes.postsTumblr);



setTimeout(function() {
  var s = new Server(io);
  s.init();
  process.env.GITHUB_KEY="c43caf3afc7f1c6b89bf";
  process.env.GITHUB_SECRET="dc981d91e0b13dfafd8676cbc5fb95e92a48efd7";
  console.log("TUMBLR:    " + process.env.TUMBLR_KEY + "     " + process.env.TUMBLR_SECRET);
  console.log("TWITTER:   " + process.env.TWITTER_KEY + "     " + process.env.TWITTER_SECRET);
  console.log("GITHUB:    " + process.env.GITHUB_KEY + "     " + process.env.GITHUB_SECRET);
  console.log("FACEBOOK:  " + process.env.FACEBOOK_ID + "     " + process.env.FACEBOOK_SECRET);

  var files = fs.readdirSync('./workers/');
  for (var i = files.length - 1; i >= 0; i--) {
    if (files[i].indexOf('.js') >= 0) {
      var name = files[i].replace('.js', '');
      var Worker = require('./workers/' + name);
      var worker = new Worker();
      if (worker.start) {
        console.log('Starting scheduler ' + name);
        worker.start();
      }
    }
  }
}, 5000);