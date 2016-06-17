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
  fetch: function(after_fetch) {
    var self = this;

    modem('GET', '/facebook/' + this.id,
      function(json) {
        self.set('facebookposts', json);
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
