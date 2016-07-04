window.FeedView = Backbone.View.extend({

  events: {
    'click #gtFilter': 'displayData',
    'click #fbFilter': 'displayData',
    'click #igFilter': 'displayData',
    'click #tbFilter': 'displayData',
    'click #twFilter': 'displayData',
    'click .show-description': 'toggleDescription'
  },

  initialize: function(user) {
    this.user = user;
    this.dados = [];
    this.allData = [];
    this.facebook = true;
    this.twitter = true;
    this.tumblr = true;
    this.instagram = true;
    this.github = true;
  },

  toggleDescription: function(event){
    console.log(event.currentTarget);
    var i = event.currentTarget.id;
    var str = '#message-div-' + i;
    if(!$(str).hasClass('toggled')){
      $(str).fadeIn('slow');
      $(str).addClass('toggled');
    } else{
      $(str).fadeOut('slow');
      $(str).removeClass('toggled');
    }
  },

  removeByFlag: function(social) {
    var self = this;
    var newData = [];
    for (var i = 0; i < this.dados.length; i++) {
      if (this.dados[i].flag != social) {
        newData.push(this.dados[i]);
      }
    }
    this.dados = newData;
  },

  addByFlag: function(social) {
    var self = this;
    var newData = [];
    for (var i = 0; i < this.allData.length; i++) {
      if (this.allData[i].flag == social) {
        this.dados.push(this.allData[i]);
      }
    }
  },

  displayData: function(e) {
    var self = this;

    var type = $(e.currentTarget).data('type');
    switch (type) {
      case 'facebook':
        if (this.facebook == true) {
          self.removeByFlag(type);
          this.facebook = false;
          break;
        } else {
          self.addByFlag(type);
          this.facebook = true;
          break;
        }
      case 'instagram':
        if (this.instagram == true) {
          self.removeByFlag(type);
          this.instagram = false;
          break;
        } else {
          self.addByFlag(type);
          this.instagram = true;
          break;
        }
      case 'github':
        if (this.github == true) {
          self.removeByFlag(type);
          this.github = false;
          break;
        } else {
          self.addByFlag(type);
          this.github = true;
          break;
        }
      case 'tumblr':
        if (this.tumblr == true) {
          self.removeByFlag(type);
          this.tumblr = false;
          break;
        } else {
          self.addByFlag(type);
          this.tumblr = true;
          break;
        }
      case 'twitter':
        if (this.twitter == true) {
          self.removeByFlag(type);
          this.twitter = false;
          break;
        } else {
          self.addByFlag(type);
          this.twitter = true;
          break;
        }
    };

    self.drawData(this.dados.sort(self.sortJsonByCol('created_time')));
  },

  sortJsonByCol: function(property) {
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

  buttonColor: function() {
    var self = this;

    if (this.facebook == true) {
      $('#fbFilter', this.el).css('color', '#3B5998');
    } else {
      $('#fbFilter', this.el).css('color', 'gray');
    }
    if (this.github == true) {
      $('#gtFilter', this.el).css('color', 'black');
    } else {
      $('#gtFilter', this.el).css('color', 'gray');
    }
    if (this.tumblr == true) {
      $('#tbFilter', this.el).css('color', '#35465c');
    } else {
      $('#tbFilter', this.el).css('color', 'gray');
    }
    if (this.twitter == true) {
      $('#twFilter', this.el).css('color', '#55acee');
    } else {
      $('#twFilter', this.el).css('color', 'gray');
    }
    if (this.instagram == true) {
      $('#igFilter', this.el).css('color', '#fb3958');
    } else {
      $('#igFilter', this.el).css('color', 'gray');
    }

  },

  handleData: function() {
    var self = this;
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
        if (facebook.message != undefined) {
          doc.message = facebook.message;
        } else {
          doc.message = '';
        }
        doc.image = 'null';
        if (facebook.full_picture != null) {
          doc.image = facebook.full_picture;
        }
        doc.flag = 'facebook';
        ArrayFinal.push(doc);
      }
    }

    if (data.instagram != null) {

      for (var i = 0; i < data.instagram.length; i++) {
        var doc = {};
        var instagram = data.instagram[i];
        var date = new Date(instagram.created_time * 1000).toJSON()
          .replace(/(T)|(\..+$)/g, function(match, p1, p2) {
            return match === p1 ? " " : ""
          });
        doc.created_time = date;
        doc.link = instagram.link;

        doc.message = " ";
        if (instagram.caption != null) {
          if (instagram.caption.text != null) {
            doc.message = instagram.caption.text;
          }
        }
        doc.image = 'null';
        if (instagram.images.standard_resolution.url != null) {
          doc.image = instagram.images.standard_resolution.url;
        }
        doc.flag = 'instagram';
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
        doc.image = 'null';
        if (twitter.entities.media != null) {
          doc.image = twitter.entities.media[0].media_url;
        }
        doc.flag = 'twitter';
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
        doc.image = 'null';
        if (tumblr.photos != null) {
          doc.image = tumblr.photos[0].alt_sizes[0].url;
        }
        doc.flag = 'tumblr';
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
        doc.image = 'null';
        doc.image = github.org.avatar_url;
        doc.flag = 'github';
        ArrayFinal.push(doc);
      }
    }

    var data = ArrayFinal.sort(self.sortJsonByCol('created_time'));


    return data;
  },

  auth: function(e) {
    if (!window.sessionStorage.getItem("keyo")) {
      app.navigate("/#", true);
      return false;
    }
    return true;
  },

  drawData: function(data) {
    var self = this;
    $(this.el).html(this.template());
    self.buttonColor();
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      var image = '';
      var flagImage = '0';
      if (data[i].image != 'null') {
        image = data[i].image;
        flagImage = '1';
      };
      var css = '';
      if (data[i].flag != null) {
        css = data[i].flag;
      };

      var coise = '';
      var coise2 = '';
      if(css === 'instagram'){
         coise = 'rgba(231,61,82,0.05)'
         coise2 = '<a class=""><i class="fa fa-instagram hover-instagram" style="font-size: 50px"></i></a>';
      } else if( css === 'facebook'){
        coise = 'rgba(59,89,152, 0.05)';
        coise2 = '<a class=""><i class="fa fa-facebook-official hover-facebook" style="font-size: 50px"></i></a>';
      } else if( css === 'twitter'){
        coise = 'rgba(29,161,242, 0.2)';
        coise2 = '<a href="#" class="social-twitter"><i style="font-size: 50px" class="fa fa-twitter-square hover-twitter"></i></a>';
      } else if( css === 'tumblr'){
        coise = 'rgba(29,161,242, 0.2)';
        coise2 = '<a href="#" class="social-tumblr"><i style="font-size: 50px" class="fa fa-tumblr-square hover-tumblr"></i></a>';
      } else if( css === 'github'){
        coise = 'rgba(10,10,10, 0.2)';
        coise2 = '<a href="#" class="social-github"><i style="font-size: 50px" class="fa fa-github-square hover-github"></i></a>';
      }

      var toggler = '';
      if(data[i].message !== ' '){
        toggler = '<div style="position:absolute: bottom: 0px; right: 0px;" class="textFeed">' +
          '<a id="'+ i +'" class="show-description"><i class="fa fa-align-justify" aria-hidden="true"></i></a>' +
        '</div>';
      }

      $('#posts', this.el).append(
            '<div style="position: relative; margin: 30px; padding-left: 11%; padding-top: 40px; background-color:' + coise +'; border-radius: 20px; float:left; min-width: 640px;">' +
              '<div style="text-align: left; position: absolute; top: 36.5px; left: 5%">' +
                coise2 +
              '</div>' +
              '<div style="position:absolute: bottom: 0px; left: 0px;" class="textFeed">' +
                '<a>' + data[i].created_time + '</a>' +
              '</div>' +
              toggler +
  	          '<div class="iso-box-wrapper col4-iso-box" style="float:left; margin-bottom: 20px; max-width: 460px;">'+
  		          '<div class="iso-box photoshop branding col-md-5" style="float:left; width: 100%;">' +
                  '<div class="portfolio-thumb ' + css + '" style="float:left;">'+
                    '<div style="opacity: '+flagImage+'" style="float:left;">' +
                      '<img src="'+image+'" class="img-responsive" alt="Portfolio" width="430">' +
                    '</div>' +
                    '<div class="portfolio-overlay">'+
                      'asda'+
                      '<div class="portfolio-item">'+
                        '<a href="' + data[i].link + '">'+
                          '<i class="fa fa-link"></i>'+
                          '<h2>' + data[i].flag + '</h2>'+
                        '</a>'+
                      '</div>'+
                    '</div>'+
                  '</div>' +
                '</div>'+
              '</div>' +
              '<div id="message-div-' + i + '" style="display: none; margin-bottom: 50px; text-align: justify; padding-right: 17%;">' +
                '<p>' + data[i].message + '</p>' +
              '</div>' +
            '</div>');
    }
  },

  render: function() {
    var self = this;

    if (!self.auth()) {
      return false;
    }

    $(this.el).html(this.template());
    this.dados = self.handleData();
    this.allData = self.handleData();
    self.drawData(this.dados);


    return this;
  }

});
