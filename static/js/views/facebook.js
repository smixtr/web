window.FacebookView = Backbone.View.extend({

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

    var data = this.model.get('facebookposts').sort(self.sortJsonByCol('created_time'));
    for (var i = 0; i < data.length; i++) {

      var countLikes = '0';
      if (data[i].likes != null) {
        var countLikes = data[i].likes.data.length;
      };
      var countComments = '0';
      if (data[i].comments != null) {
        var countComments = data[i].comments.data.length;
      };
      var image = '';
      var flagImage = 'none';
      if (data[i].full_picture != undefined) {
        image = data[i].full_picture;
        flagImage = 'show';
      };

      $('#fb', this.el).append(
        $('<div>', {
          class: 'fbPosts'
        }).append(
          $('<div>', {
            class: 'fbPostsMessage',
            text: data[i].message
          }),
          $('<div>', {
            class: 'fbPostsImg'
          }).css("display", flagImage).append(
            $('<img>', {
              src: image,
              class: 'fbImg'
            })
          ),
          $('<div>', {
            class: 'fbPostsData'
          }).append(
            $('<div>', {
              class: 'fbPostsInfo',
              text: data[i].created_time.replace('T', '  ').substring(0, 20)
            }),
            $('<div>', {
              class: 'fbPostsInfo',
              text: 'Comentarios ' + countComments
            }),
            $('<div>', {
              class: 'fbPostsInfo',
              text: 'Likes ' + countLikes
            })
          )
        )
      );
    }
    return this;
  }
});
