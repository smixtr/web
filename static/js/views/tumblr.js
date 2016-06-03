window.TumblrView = Backbone.View.extend({

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

  sortJsonByCol: function(property) {
    console.log(property);
    return function(b, a) {
      var sortStatus = 0;
      if (a[property] < b[property]) {
        sortStatus = -1;
      } else if (a[property] > b[property]) {
        sortStatus = 1;
      }
      return sortStatus;
    };
  },

  render: function() {
    var self = this;
    if (!self.auth()) {
      return false;
    }

    $(this.el).html(this.template());

    var data = this.model.get('tumblrposts');

    $('#tb', this.el).text(JSON.stringify(data));



    return this;
  }
});
