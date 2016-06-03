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


    var data = this.model.get('posts').tumblr;
    $('#txtUsername', this.el).text(JSON.stringify(data));
    return this;
  }

});
