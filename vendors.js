var oauth = require('oauth'),
  MongoClient = require('mongodb').MongoClient,
  ig = require('instagram-node').instagram(),
  GitHubApi = require("github"),
  util = require('util');


MongoClient.connect(util.format('mongodb://%s:%s/smixtr', process.env.MONGODB || '127.0.0.1', 27017), function(err, db) {
  if (err) throw err;
  console.log('Connected to mongodb.');
  exports.mongo = db;
});

exports.tumblr = new oauth.OAuth(
  "http://www.tumblr.com/oauth/request_token",
  "http://www.tumblr.com/oauth/access_token",
  process.env.TUMBLR_KEY,
  process.env.TUMBLR_SECRET,
  "1.0A",
  "http://localhost:3000/auth/tumblr/callback",
  "HMAC-SHA1"
);

/*
exports.twitter = {
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
};

exports.instagram = ig.use({
  client_id: process.env.INSTAGRAM_ID,
  client_secret: process.env.INSTAGRAM_SECRET
});

exports.github = new GitHubApi({
  version: "3.0.0"
});
*/
