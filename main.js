var express = require('express');
var app = express();
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);
var Server = require('./lib/server');

var vendors = require('./vendors');
var routes = require('./lib/http/routes');
var auth = require('./lib/http/auth');


var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

httpServer.listen(3000);

app.use(express.static('static'));

app.get('/user', auth, routes.user);

app.get('/auth/tumblr/request', auth, routes.tumblrRequest);
app.get('/auth/tumblr/callback', routes.tumblrCallback);


app.post('/user/add', routes.addUser);
app.get('/profile', auth, routes.getUserInfo);
//app.get('/user/:id', routes.getUserStream);

app.get('/posts/tumblr', auth, routes.postsTumblr);
app.get('/posts/instagram', auth, routes.postsInstagram);
app.get('/posts/facebook', auth, routes.postsFacebook);
app.get('/posts/twitter', auth, routes.postsTwitter);
app.get('/posts/github', auth, routes.postsGithub);

var s = new Server(io);
s.init();
