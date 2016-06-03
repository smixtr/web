var vendors = require('../vendors'),
  github = require('github');

var Worker = function() {
  this.client = new github({});
};

Worker.prototype.start = function() {
  var self = this;
  setInterval(function() {
    var cursor = vendors.mongo.collection('users').find({
      'githubOauthAccessToken': {
        $exists: true
      }
    });
    var found = [];
    cursor.each(function(err, doc) {
      if (doc) {
        self.client.authenticate({
          type: "token",
          token: doc.githubOauthAccessToken,
        });

        self.client.users.get({}, function(err, res) {
          var user = res.login
          //console.log(JSON.stringify(res));
          console.log(user);
          self.client.activity.getEventsForUser({
            'user': user
          }, function(err, res) {
            for (var i = 0; i < res.length; i++) {
              var obj = res[i];
              if(obj.type === 'PushEvent') {
                self.verifyPost(doc._id, obj);
              }
            }
            console.log(JSON.stringify(res));
          });
        });

      }
    });
  }, 10000);
};

Worker.prototype.verifyPost = function(userid, post) {
  vendors.mongo.collection('users').findOne({
    _id: userid,
    'githubPosts': {
      $not: {
        $elemMatch: {
          id: post.id
        }
      }
    }
  }, function(err, user) {
    if (user) {
      console.log('Adding post: ' + post.id);
      if (!user.githubPosts) {
        user.githubPosts = [];
      }
      user.githubPosts.push(post);

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
