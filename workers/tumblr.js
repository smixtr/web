var vendors = require('../vendors'),
  tumblr = require('tumblr.js');

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
          data.user.blogs.forEach(function(blog) {
            console.log(blog.name);
            client.posts(blog.name, function(err, resp) {
              console.log(resp.posts);
              for (var i = 0; i < resp.posts.length; i++) {
                self.verifyPost(doc._id, resp.posts[i]);
              }
            });
          });
        });
      }
    });
  }, 360000);
};

Worker.prototype.verifyPost = function(userid, post) {
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
      console.log('Adding post: ' + post.id);
      if (!user.tumblrPosts) {
        user.tumblrPosts = [];
      }
      user.tumblrPosts.push(post);

      vendors.mongo.collection('users').save(user, function(err, output) {
        if (err) {
          console.log('Failed to update user.');
          console.log(err);
        }
      });
    }
  });
};

module.exports = Worker;