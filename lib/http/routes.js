var vendors = require('../../vendors'),
  oauth = require('oauth'),
  crypto = require('crypto'),
  graph = require('fbgraph');

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

    //var id = crypto.createHash('md5').update(req.body.email).digest("hex");
    var password = crypto.createHash('md5').update(req.body.password).digest("hex");
    var insertUser = vendors.mongo.collection('users').insertOne({
      '_id': req.body.email,
      'auth': {
        'username': req.body.email,
        'password': password
      },
      'type': 'user',
      'status': 'active',
      'networks': {
        'FacebookFirstAccess': 'true',
        'TwiterFirstAccess': 'true',
        'GitHubFirstAccess': 'true',
        'InstagramFirstAccess': 'true',
        'TumblrFirstAccess': 'true'
      }
    }, function(err, result) {
      if (err != null)
        console.log(err);
    });
    res.status(200);
    console.log(req.body.email + '  inserted with sucess on db!');
  },

  facebookRequest: function(req, res) {
    var authUrl = graph.getOauthUrl({
      "client_id": process.env.FACEBOOK_ID,
      "redirect_uri": 'http://localhost:3000/auth/facebook/callback?user=' + req.user.auth.username,
      "scope": 'user_posts'
    });
    return res.status(200).json({
      'url': authUrl
    });
  },

  facebookCallback: function(req, res) {
    vendors.mongo.collection('users').findOne({
      _id: req.query.user
    }, function(err, user) {

      graph.authorize({
        "client_id": process.env.FACEBOOK_ID,
        "redirect_uri": 'http://localhost:3000/auth/facebook/callback?user=' + req.query.user,
        "client_secret": process.env.FACEBOOK_SECRET,
        "code": req.query.code
      }, function(err, facebookRes) {
        if (err) {
          res.send("Error getting OAuth access token: " + err, 500);
        } else {
          console.log('callback access_token   ' + facebookRes.access_token);

          user.facebookOauthAccessToken = facebookRes.access_token;


          vendors.mongo.collection('users').save(user, function(err, output) {
            if (err) {
              console.log('Failed to update user.'.red);
              console.log(err);
            }
          });
        }
      });
      res.redirect('/#profile/');
    });
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
  twitterRequest: function(req, res) {

    var otwitter = new oauth.OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      process.env.TWITTER_KEY,
      process.env.TWITTER_SECRET,
      "1.0A",
      "http://localhost:3000/auth/twitter/callback?user=" + req.user.auth.username,
      "HMAC-SHA1"
    );

    otwitter.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret) {
      if (error) {
        console.log(error);
        res.send("Error getting OAuth request token: " + error, 500);
      } else {
        req.user.twitterOauthRequestToken = oauthToken;
        req.user.twitterOauthRequestTokenSecret = oauthTokenSecret;
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
  twitterCallback: function(req, res) {
    console.log('entrou ainda n');

    console.log(req.user);
    console.log(Object.keys(req.query));
    console.log('entrou ainda n');
    var otwitter = new oauth.OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      process.env.TWITTER_KEY,
      process.env.TWITTER_SECRET,
      "1.0A",
      "http://localhost:3000/auth/twitter/callback",

      "HMAC-SHA1"
    );
    vendors.mongo.collection('users').findOne({
      _id: req.query.user
    }, function(err, user) {
      otwitter.getOAuthAccessToken(user.twitterOauthRequestToken, user.twitterOauthRequestTokenSecret, req.query.oauth_verifier, function(error, _oauthAccessToken, _oauthAccessTokenSecret) {
        if (error) {
          res.send("Error getting OAuth access token: " + error, 500);
        } else {

          user.twitterOauthAccessToken = _oauthAccessToken;
          user.twitterOauthAccessTokenSecret = _oauthAccessTokenSecret;

          vendors.mongo.collection('users').save(user, function(err, output) {
            if (err) {
              console.log('Failed to update user.'.red);
              console.log(err);
            }
          });
        }
      });

      res.redirect('/#' + req.query.user);

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
      if (doc) {
        //if (doc.tumblrPosts) {
        posts.tumblr = doc.tumblrPosts;
        posts.facebook = doc.facebookPosts;
        //}
      }
      console.log(posts)
      return res.status(200).json(posts);
    });
  },

  postsFacebook: function(req, res) {

    var userid = req.params.user;
    var posts = {};
    console.log(userid);
    var query = {
      _id: userid
    };
    vendors.mongo.collection('users').findOne(query, function(err, doc) {
      if (doc) {
        if (doc.facebookPosts) {
          posts.facebookPosts = doc.facebookPosts;
        }
      }
      res.status(200).json(posts.facebookPosts);
    });
  },

  postsTumblr: function(req, res) {

    var userid = req.params.user;
    console.log(userid);
    var posts = {};

    var query = {
      _id: userid
    };
    vendors.mongo.collection('users').findOne(query, function(err, doc) {
      if (doc) {

        if (doc.tumblrPosts) {
          console.log(doc.tumblrPosts);
          posts.tumblrPosts = doc.tumblrPosts;
        }
      }
      res.status(200).json(posts.tumblrPosts);
    });
  },

  postsInstagram: function(req, res) {
    var userid = req.params.user;
    console.log(userid);
    var posts = {};

    var query = {
      _id: userid
    };
    vendors.mongo.collection('users').findOne(query, function(err, doc) {
      if (doc) {

        if (doc.Posts) {
          console.log(doc.tumblrPosts);
          posts.instagramPosts = doc.instagramPosts;
        }
      }
      res.status(200).json(posts.tumblrPosts);
    });
  },
  postsTwitter: function(req, res) {},
  postsGithub: function(req, res) {},

}
