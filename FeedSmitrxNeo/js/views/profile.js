window.ProfileView = Backbone.View.extend({

  events: {
    'click #btnGoBack': 'goback',
    'click #btnTumblr': 'tumblr',
    'click #btnTwitter': 'twitter',
    'click #btnFacebook': 'facebook',
    'click #btnInstagram': 'instagram',
    'click #btnGithub': 'github',
    'click #btnLogOut': 'logout'

  },

  initialize: function() {

  },

  tumblr: function() {
    modem('GET', '/auth/tumblr/request',
      function(json) {
        console.log(json);
        window.location = "http://www.tumblr.com/oauth/authorize?oauth_token=" + json.token;

      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
  facebook: function() {
    modem('GET', '/auth/facebook/request',
      function(json) {
        console.log(json);

        window.location = json.url;
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
  twitter: function() {
    modem('GET', '/auth/twitter/request',
      function(json) {
        console.log(json);
        window.location = "https://api.twitter.com/oauth/authenticate?oauth_token=" + json.token;
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
    github: function() {
    modem('GET', '/auth/github/request',
      function(json) {
        console.log(json);

        window.location = json.url;
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
  instagram: function() {
    modem('GET', '/auth/instagram/request',
      function(json) {
        console.log(json);

        window.location = json.url;
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },
  auth: function(e) {
    if (!window.sessionStorage.getItem("keyo")) {
      app.navigate("/#", true);
      return false;
    }
    return true;
  },

  goback: function() {
    app.navigate('', {
      trigger: true
    });
  },

  logout: function() {
    sessionStorage.clear();
    app.navigate('', {
      trigger: true
    });
  },



  render: function() {
    var self = this;
    if (!self.auth()) {
      return false;
    }

    modem('GET', '/profile',
      function(json) {
        //console.log('futura info' +json.toDo);
        $('#txtID').text(json._id);
        $('#txtUsername').text(json.auth.username);
        $('#txtPassword').text(json.auth.password);
        $('#txtStatus').text(json.status);
        $('#txtType').text(json.type);
        console.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log('ProfileView GET /profile:  ' + json);
      }
    );
    $(this.el).html(this.template());
    return this;
  }

});
