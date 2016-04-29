window.ProfileView = Backbone.View.extend({

    events: {

    },

    initialize: function() {

    },

    auth: function (e) {
        if (!window.sessionStorage.getItem("keyo")) {
            app.navigate("/#", true);
            return false;
        }
        return true;
    },

    render: function() {
      var self=this;
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
              console.log('ProfileView GET /profile:  ' +json);
          }
      );
        $(this.el).html(this.template());
        return this;
    }

});
