var vendors = require('../vendors'),
  Twit = require('twit'),
  async = require('async');

var Worker = function() {
  this.client = new Twit({});
};

Worker.prototype.start = function() {
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
        self.client({
          consumer_key: process.env.TWITTER_KEY,
          consumer_secret: process.env.TWITTER_SECRET,
          access_token: doc.twitterOauthAccessToken,
          access_token_secret: doc.twitterOauthAccessTokenSecret,
        });
        client.setAuth(client);
        client.get('statuses/user_timeline', function(err, data, response) {
          verifyPost(doc._id, data);
        });
      }
    });
  }, 6000);
};

//TWITTER_KEY=EKT9YuYCDMTd6sFoIHVgIM6Gk
//TWITTER_SECRET=vuSSMQ7C6Vr2J9VJwH44WPsFgSO8xnzohIdNowfm68GJEg0GA4
Worker.prototype.verifyPost = function(userid, posts) {
  async.mapSeries(posts, function(post, callback) {
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
          callback();
        });
      } else {
        callback();
      }
    });
  });
};

module.exports = Worker;
