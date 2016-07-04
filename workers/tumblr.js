var vendors = require('../vendors'),
  tumblr = require('tumblr.js'),
  async = require('async');

var Worker = function() {};

Worker.prototype.start = function() {
  var self = this;
  setInterval(function() {
    var cursor = vendors.mongo.collection('users').find({
      'tumblrOauthAccessToken': {
        $exists: true
      }
    });
    var found = [];
    cursor.each(function(err, doc) {
      if (doc) {
        this.client = tumblr.createClient({
          consumer_key: process.env.TUMBLR_KEY,
          consumer_secret: process.env.TUMBLR_SECRET,
          token: doc.tumblrOauthAccessToken,
          token_secret: doc.tumblrOauthAccessTokenSecret
        });

        this.client.userInfo(function(err, data) {
          if (!err) {
            data.user.blogs.forEach(function(blog) {

              this.client.posts(blog.name, function(err, resp) {

                self.verifyPost(doc._id, resp.posts);
              });
            });
          }
        });
      }
    });
  }, 8000);
};

Worker.prototype.verifyPost = function(userid, posts) {
  async.mapSeries(posts, function(post, callback) {
    vendors.mongo.collection('users').findOne({
      _id: userid,
      'tumblrPosts': {
        $not: {
          $elemMatch: {
            id: post.id
          }
        }
      }
    }, function(err, user) {
      if (user) {

        if (!user.tumblrPosts) {
          user.tumblrPosts = [];
        }
        user.tumblrPosts.push(post);
        console.log('added tb  ' + post.id);
        vendors.mongo.collection('users').save(user, function(err, output) {
          if (err) {
            console.log('Failed to update user.');

          }
          callback();
        });
      } else {
        callback();
      }
    });
  });
};

module.exports = Worker;
