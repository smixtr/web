window.HomeView = Backbone.View.extend({
  events: {
    'click #btnLogin': 'login',
    'click #btnTumblr': 'tumblr'
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

  login: function() {
    var user = $('#txtEmail').val();
    var password = $('#txtPassword').val();

    var credential = user + ':' + password;
    sessionStorage.setItem('keyo', btoa(credential));

    modem('GET', '/user',
      function(json) {
        console.log(json);
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
      }
    );
  },

  render: function() {
    $(this.el).html(this.template());

    $.templatemo_is_chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
    $.templatemo_is_ie = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);


    // Javascropt parallax effect config for different browser.
    // Chrome broswer setting
    if ($.templatemo_is_chrome) {
      $("html").attr("style", "overflow:auto;");
      $("body").attr("style", "overflow:auto;height:auto;");
      $('#templatemo_home', this.el).parallax("50%", 0.1);
      $('#templatemo_download', this.el).parallax("50%", 0.1);
      // Non IE broswer setting
    } else if (!$.templatemo_is_ie) {
      $("html").attr("style", "overflow: auto;");
      $("body").attr("style", "background: #455a64;overflow: auto;height: auto;");
      $('#templatemo_home', this.el).parallax("50%", 0.1);
      $('#templatemo_download', this.el).parallax("50%", 0.1);
      // IE broswer setting
    } else {
      $('#templatemo_home', this.el).parallax("50%", 0.5);
      $('#templatemo_download', this.el).parallax("50%", 0.5);
    }

    return this;
  }

});
