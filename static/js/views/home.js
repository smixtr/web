window.HomeView = Backbone.View.extend({
    events: {
        'click #btnLogin': 'login',
        'click #btnTumblr': 'tumblr',
		 'click #btnTwitter': 'twitter',
        //mostrar form para registar
        'click #btnShowRegister': 'showRegisterForm',
        //enviar registo para DB
        'click #btnRegister': 'register'
    },


    login: function() {

        var user = $('#txtEmail').val() || $('#regTxtEmail').val();
        var password = $('#txtPassword').val() || $('#regTxtPassword').val();

        var credential = user + ':' + password;
        sessionStorage.setItem('keyo', btoa(credential));

        modem('GET', '/user',
            function(json) {
                //app.nav
                setTimeout(function () {
                  app.navigate('#profile', {
                      trigger: true
                    });
                }, 1200);

                console.log('modem. get/user: ' + json);
            },
            function(xhr, ajaxOptions, thrownError) {
                var json = JSON.parse(xhr.responseText);
                console.log('ERROR modem GET /user:  ' + json);
            }
        );
    },

    register: function(e) {
        var self = this;
        e.preventDefault();

        modem('POST', '/user/add',
            function(json) {

                console.log('registou' + json);
            },
            function(xhr, ajaxOptions, thrownError) {
                console.log(xhr.responseText);

                var json = JSON.parse(xhr.responseText);
            },
            $("#registerForm").serialize()
        )
        self.login();
    },

    showRegisterForm: function() {
        $("#registerForm").attr("style", "display:show;");
        $("#initialForm").attr("style", "display:none; Height:0px !important");
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
	twitter: function() {
        modem('GET', '/auth/twitter/request',
            function(json) {
                console.log("in authenticate: " + json);
                window.location = "https://api.twitter.com/oauth/authenticate?oauth_token=" + json.token;
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
