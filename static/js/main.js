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
        '*notFound': 'index'
    },

    initialize: function() {
        var self = this;
        this.on('route', function(e) {
            var self = this;
            self.footer = $('#footer').html(new FooterView().render().el);
        });
    },

    profile: function() {
        var self = this;
        var profileView = new ProfileView();
        self.showView(profileView, $('#content'));
    },

    home: function() {
        var self = this;
        var homeView = new HomeView({
            model: window.profile
        });
        self.showView(homeView, $('#content'));
    },

    verifyLogin: function(loggedFunction) {
        var self = this;
        if (!getKeyo()) {
            app.navigate('/login', {
                trigger: true
            });
        } else {
            window.logged = true;
            loggedFunction();
        }
    }
});

templateLoader.load(['FooterView', 'HomeView', 'ProfileView'], function() {
    app = new Router();
    Backbone.history.start();
});
