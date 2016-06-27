window.FeedView = Backbone.View.extend({

  events: {

  },

  initialize: function(user) {
    this.user = user;

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

  auth: function(e) {
    if (!window.sessionStorage.getItem("keyo")) {
      app.navigate("/#", true);
      return false;
    }
    return true;
  },

  render: function() {
    var self = this;
    /*
          if (!self.auth()) {
            return false;
          }*/

    $(this.el).html(this.template());

    var ArrayFinal = [];
    var data = this.model.get('posts');
    if (data.facebook != null) {

      for (var i = 0; i < data.facebook.length; i++) {
        var doc = {};
        var facebook = data.facebook[i];
        var date = new Date(facebook.created_time).toJSON()
          .replace(/(T)|(\..+$)/g, function(match, p1, p2) {
            return match === p1 ? " " : ""
          });
        doc.created_time = date;
        //doc.link = '';
        doc.message = facebook.message;
        if (facebook.full_picture != null) {
          doc.image = facebook.full_picture;
        }
        doc.flag = 'fb';
        ArrayFinal.push(doc);
      }
    }

    if (data.instagram != null) {

      for (var i = 0; i < data.instagram.length; i++) {
        var doc = {};
        var instagram = data.instagram[i];

        var date = new Date(instagram.created_time);
        doc.created_time = date;
        doc.link = instagram.link;
        doc.message = instagram.text;
        if (instagram.images.standard_resolution.url != null) {
          doc.image = instagram.images.standard_resolution.url;
        }
        doc.flag = 'ig';
        ArrayFinal.push(doc);
      }
    }


    if (data.twitter != null) {

      for (var i = 0; i < data.twitter.length; i++) {
        var doc = {};
        var twitter = data.twitter[i];

        var date = new Date(twitter.created_at).toJSON()
          .replace(/(T)|(\..+$)/g, function(match, p1, p2) {
            return match === p1 ? " " : ""
          });
        doc.created_time = date;
        if (twitter.entities.media != null) {
          doc.link = twitter.entities.media[0].expanded_url;
        }
        doc.message = twitter.text;
        if (twitter.entities.media != null) {
          doc.image = twitter.entities.media[0].url;
        }
        doc.flag = 'tw';

        ArrayFinal.push(doc);
      }
    }
    if (data.tumblr != null) {


      for (var i = 0; i < data.tumblr.length; i++) {
        var tumblr = data.tumblr[i];
        var doc = {};
        var date = new Date(tumblr.date).toJSON()
          .replace(/(T)|(\..+$)/g, function(match, p1, p2) {
            return match === p1 ? " " : ""
          });
        doc.created_time = date;
        doc.link = tumblr.short_url;
        doc.message = tumblr.summary;
        if (tumblr.photos != null) {
          doc.image = tumblr.photos[0].alt_sizes[0].url;
        }
        doc.flag = 'tb';

        ArrayFinal.push(doc);
      }
    }
    if (data.github != null) {

      for (var i = 0; i < data.github.length; i++) {
        var doc = {};
        var github = data.github[i];
        var date = new Date(github.created_at).toJSON()
          .replace(/(T)|(\..+$)/g, function(match, p1, p2) {
            return match === p1 ? " " : ""
          });
        doc.created_time = date;
        doc.link = github.repo.url;
        doc.message = github.payload.commits[0].message;
        doc.image = github.org.avatar_url;
        doc.flag = 'gt';
      }
    }


    $('#txtUsername', this.el).text(JSON.stringify(ArrayFinal.sort(self.sortJsonByCol('created_time'))));
    return this;
  }

});
