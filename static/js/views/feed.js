window.FeedView = Backbone.View.extend({

  events: {

  },

  initialize: function(user) {
    this.user = user;
  },

  auth: function(e) {
    if (!window.sessionStorage.getItem("keyo")) {
      app.navigate("/#", true);
      return false;
    }
    return true;
  },

  render: function() {
    var self = this;
    if (!self.auth()) {
      return false;
    }


    $(this.el).html(this.template());

    $('#txtUsername', this.el).text(this.model.get('posts').tumblr[0].blog_name);

    console.log(this.model.get('posts'));
    return this;
  }

});
