var vendors = require('../vendors'),
  request = require('request'),
  async = require('async');

var Worker = function() {};

Worker.prototype.start = function() {
  var self = this;
  setInterval(function() {
    var cursor = vendors.mongo.collection('users').find({
      'instagramOauthAccessToken': {
        $exists: true
      }
    });
    var found = [];
    cursor.each(function(err, doc) {
      if (doc) {
        console.log(doc.instagramOauthAccessToken);

        request.get('https://api.instagram.com/v1/users/self/media/recent/?access_token=' + doc.instagramOauthAccessToken, function optionalCallback(err, httpResponse, body) {
          //console.log(body);
          if (!err) {
            var data = JSON.parse(body);
            self.verifyPost(doc._id, data.data);
          }
        });
      }
    });
  }, 10000);
};

Worker.prototype.verifyPost = function(userid, posts) {
  async.mapSeries(posts, function(post, callback) {
    vendors.mongo.collection('users').findOne({
      _id: userid,
      'instagramPosts': {
        $not: {
          $elemMatch: {
            id: post.id
          }
        }
      }
    }, function(err, user) {
      if (user) {
        console.log('Adding post: ' + post.id);
        if (!user.instagramPosts) {
          user.instagramPosts = [];
        }
        user.instagramPosts.push(post);

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
