var vendors = require('../vendors'),
  graph = require('fbgraph');

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
        graph.get("/me?fields=id,name,feed", function(err, res) {
          console.log(res);
        });
      }
    });
  }, 5000);
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
