var vendors = require('../vendors'),
  graph = require('fbgraph'),
  async = require('async');

var Worker = function() {};

Worker.prototype.start = function() {

  var self = this;
  setInterval(function() {
    var cursor = vendors.mongo.collection('users').find({
      'facebookOauthAccessToken': {
        $exists: true
      }
    });
    var found = [];
    cursor.each(function(err, doc) {
      if (doc) {
        graph.setAccessToken(doc.facebookOauthAccessToken);

        graph.get("me/POSTS?fields=comments.limit(1000),created_time,full_picture,message,likes&limit=1000", function(err, feed) {
          if (feed != null) self.verifyPost(doc._id, feed.data);
        });
      };
    });
  }, 8000);
};

Worker.prototype.verifyPost = function(userid, posts) {
  async.mapSeries(posts, function(post, callback) {
    vendors.mongo.collection('users').findOne({
      _id: userid,
      'facebookPosts': {
        $not: {
          $elemMatch: {
            id: post.id
          }
        }
      }
    }, function(err, user) {
      if (user) {
        if (!user.facebookPosts) {
          user.facebookPosts = [];
        }
        console.log('added fb  ' + post.id);
        user.facebookPosts.push(post);
        vendors.mongo.collection('users').save(user, function(err, output) {
          if (err) {
            console.log('Failed to update user.');
            console.log(err);
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
