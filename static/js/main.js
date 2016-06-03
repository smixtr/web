Backbone.View.prototype.close = function() {
  this.remove();
  this.unbind();
  this.undelegateEvents();
};

var Router = Backbone.Router.extend({
  footer: undefined,
  currentView: undefined,
  showView: function(view, elem, sub) {
    elem.show();

    if (this.currentView) {
      this.currentView.close();
    }
    this.currentView = view;
    this.currentView.delegateEvents();

    var rendered = view.render();
    elem.html(rendered.el);
  },

  routes: {
    '': 'home',
    'index': 'home',
    'home': 'home',
    'profile': 'profile',
    ':user': 'feed',
    "facebook/:id": 'facebook',
    "tumblr/:id": 'tumblr',
    '*notFound': 'index'
  },


  initialize: function() {
    var self = this;
    this.on('route', function(e) {
      var self = this;
      self.home = $('#content').html(new HomeView().render().el);
      self.footer = $('#footer').html(new FooterView().render().el);
    });
  }

});

templateLoader.load(['FooterView', 'HomeView', 'ProfileView'], function() {
  app = new Router();
  Backbone.history.start();
});
