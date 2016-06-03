var vendors = require('../vendors'),
  twitter = require('twitter');

var Worker = function() {};

Worker.prototype.starta = function() {
  var self = this;
  setInterval(function() {
    var cursor = vendors.mongo.collection('users').find({
      'twitterOauthAccessToken': {
        $exists: true
      }
    });
    var found = [];
    cursor.each(function(err, doc) {
      if (doc) {
        this.client = twitter.createClient({
          consumer_key: process.env.TWITTER_KEY,
          consumer_secret: process.env.TWITTER_SECRET,
          token: doc.twitterOauthAccessToken,
          token_secret: doc.twitterOauthAccessTokenSecret
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
  }, 60000);
};

Worker.prototype.verifyPost = function(userid, post) {
  vendors.mongo.collection('users').findOne({
    _id: userid,
    'twitterPosts': {
      $not: {
        $elemMatch: {
          id: post.id
        }
      }
    }
  }, function(err, user) {
    if (user) {
      console.log('Adding post: ' + post.id);
      if (!user.twitterPosts) {
        user.twitterPosts = [];
      }
      user.twitterPosts.push(post);

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
