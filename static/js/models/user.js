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
