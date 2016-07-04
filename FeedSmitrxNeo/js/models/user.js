var User = Backbone.Model.extend({
  initialize: function(id) {
    this.id = id;
  },
  fetch: function(after_fetch) {
    var self = this;

    modem('GET', '/posts/' + this.id,
      function(json) {
        self.set('posts', json);
        after_fetch();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log('ProfileView GET /profile:  ' + json);
        after_fetch();
      }
    );
  }
});

var FacebookPosts = Backbone.Model.extend({
  initialize: function(id) {
    this.id = id;
  },
  fetch: function() {
    var self = this;
    modem('GET', '/facebook/' + this.id,
      function(json) {
        self.set('facebookposts', json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log('ProfileView GET /profile:  ' + json);

      }
    );
  }
});

var TumblrPosts = Backbone.Model.extend({
  initialize: function(id) {
    this.id = id;
  },
  fetch: function(after_fetch) {
    var self = this;

    modem('GET', '/tumblr/' + this.id,
      function(json) {
        self.set('tumblrposts', json);
        after_fetch();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log('ProfileView GET /profile:  ' + json);
        after_fetch();
      }
    );
  }
});

var GithubPosts = Backbone.Model.extend({
  initialize: function(id) {
    this.id = id;
  },
  fetch: function(after_fetch) {
    var self = this;

    modem('GET', '/github/' + this.id,
      function(json) {
        self.set('githubposts', json);
        after_fetch();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log('ProfileView GET /profile:  ' + json);
        after_fetch();
      }
    );
  }
});

var InstagramPosts = Backbone.Model.extend({
  initialize: function(id) {
    this.id = id;
  },
  fetch: function(after_fetch) {
    var self = this;

    modem('GET', '/instagram/' + this.id,
      function(json) {
        self.set('instagramposts', json);
        after_fetch();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log('ProfileView GET /profile:  ' + json);
        after_fetch();
      }
    );
  }
});

var TwitterPosts = Backbone.Model.extend({
  initialize: function(id) {
    this.id = id;
  },
  fetch: function(after_fetch) {
    var self = this;

    modem('GET', '/twitter/' + this.id,
      function(json) {
        self.set('twitterposts', json);
        after_fetch();
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log('ProfileView GET /profile:  ' + json);
        after_fetch();
      }
    );
  }
});
