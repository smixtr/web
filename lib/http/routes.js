var vendors = require('../../vendors'),
  oauth = require('oauth'),
  crypto = require('crypto');

module.exports = {
  user: function(req, res) {
    console.log(req.params.user);
    var query = {
      _id: req.user.auth.username
    };
    vendors.mongo.collection('users').findOne(query, function(err, doc) {
      if (err || !doc) {
        return res.status(200).json({
          'error': 'Error fetching user (DB)'
        });
      }
      delete doc.auth.password;
      return res.status(200).json(doc);
    });
  },

  addUser: function(req, res) {

    var id = crypto.createHash('md5').update(req.body.email).digest("hex");
    var password = crypto.createHash('md5').update(req.body.password).digest("hex");
    var insertUser = vendors.mongo.collection('users').insertOne({
      '_id': id,
      'auth': {
        'username': req.body.email,
        'password': password
      },
      'type': 'user',
      'status': 'active'
    }, function(err, result) {
      if (err != null)
        console.log(err);
    });
    res.status(200);
    console.log(req.body.email + '  inserted with sucess on db!');
  },

  tumblrRequest: function(req, res) {

    var otumblr = new oauth.OAuth(
      "http://www.tumblr.com/oauth/request_token",
      "http://www.tumblr.com/oauth/access_token",
      process.env.TUMBLR_KEY,
      process.env.TUMBLR_SECRET,
      "1.0A",
      "http://localhost:3000/auth/tumblr/callback?user=" + req.user.auth.username,
      "HMAC-SHA1"
    );

    otumblr.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret) {
      if (error) {
        res.send("Error getting OAuth request token: " + error, 500);
      } else {
        req.user.tumblrOauthRequestToken = oauthToken;
        req.user.tumblrOauthRequestTokenSecret = oauthTokenSecret;
        vendors.mongo.collection('users').save(req.user, function(err, output) {
          if (err) {
            console.log('Failed to update user.'.red);
            console.log(err);
          }

          return res.status(200).json({
            'token': oauthToken
          });
        });
      }
    });
  },

  tumblrCallback: function(req, res) {
    console.log(req.query);

    var otumblr = new oauth.OAuth(
      "http://www.tumblr.com/oauth/request_token",
      "http://www.tumblr.com/oauth/access_token",
      process.env.TUMBLR_KEY,
      process.env.TUMBLR_SECRET,
      "1.0A",
      "http://localhost:3000/auth/tumblr/callback",
      "HMAC-SHA1"
    );

    vendors.mongo.collection('users').findOne({
      _id: req.query.user
    }, function(err, user) {
      otumblr.getOAuthAccessToken(user.tumblrOauthRequestToken, user.tumblrOauthRequestTokenSecret, req.query.oauth_verifier, function(error, _oauthAccessToken, _oauthAccessTokenSecret) {
        if (error) {
          res.send("Error getting OAuth access token: " + error, 500);
        } else {

          user.tumblrOauthAccessToken = _oauthAccessToken;
          user.tumblrOauthAccessTokenSecret = _oauthAccessTokenSecret;

          vendors.mongo.collection('users').save(user, function(err, output) {
            if (err) {
              console.log('Failed to update user.'.red);
              console.log(err);
            }
          });
        }
      });
      res.send("You are signed in. <a href='/test'>Test</a>");
    });
  },

  getUserInfo: function(req, res) {

    var query = {
      _id: req.user._id
    };
    vendors.mongo.collection('users').findOne(query, function(err, doc) {
      if (err || !doc) {
        console.log('erro:    ' + err);
      }
      return res.status(200).json(doc || {});
    });
  },

  posts: function(req, res) {
    var userid = req.params.user;
    var posts = {};

    var query = {
      _id: userid
    };
    vendors.mongo.collection('users').findOne(query, function(err, doc) {
      if(doc) {
        if(doc.tumblrPosts) {
          posts.tumblr = doc.tumblrPosts;
        }
      }

      return res.status(200).json(posts);
    });
  },

  postsTumblr: function(req, res) {},
  postsInstagram: function(req, res) {},
  postsFacebook: function(req, res) {},
  postsTwitter: function(req, res) {},
  postsGithub: function(req, res) {},


}
