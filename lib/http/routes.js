var vendors = require('../../vendors');

module.exports = {

  tumblrRequest: function(req, res) {
    vendors.tumblr.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret) {
      if (error) {
        res.send("Error getting OAuth request token: " + error, 500);
      } else {
        oauthRequestToken = oauthToken;
        oauthRequestTokenSecret = oauthTokenSecret;

        res.redirect("http://www.tumblr.com/oauth/authorize?oauth_token=" + oauthRequestToken);
      }
    });
  },

  tumblrCallback: function(req, res) {
    vendors.tumblr.getOAuthAccessToken(oauthRequestToken, oauthRequestTokenSecret, req.query.oauth_verifier, function(error, _oauthAccessToken, _oauthAccessTokenSecret) {
      if (error) {
        res.send("Error getting OAuth access token: " + error, 500);
      } else {
        tumblrOauthAccessToken = _oauthAccessToken;
        tumblrOauthAccessTokenSecret = _oauthAccessTokenSecret;

        res.send("You are signed in. <a href='/test'>Test</a>");
      }
    });
  },

  postsTumblr: function(req, res) {},
  postsInstagram: function(req, res) {},
  postsFacebook: function(req, res) {},
  postsTwitter: function(req, res) {},
  postsGithub: function(req, res) {}

};
