define('Router', [
  'jquery',
  'underscore',
  'backbone',
  'HomeView',
  'HeaderView',
  'UserListView',
  'UserView',
  'UserEditView',
  'UserModel'
  // TODO: add other views
], function($, _, Backbone, HomeView, HeaderView, UserListView, UserView, UserEditView, User) {
  var AppRouter, initialize;

  AppRouter = Backbone.Router.extend({
    routes: {
      ''            : 'home',
      'home'        : 'home',
      
      'users'     : 'showUsers', // /#/users
      'users/new' : 'addUser',
      'users/:id' : 'showUser',
      'users/:id/edit' : 'editUser',
      // <TODO - add any other views
      
      // any other action defaults to the following handler
      '*actions'    : 'defaultAction'
    },
    initialize: function() {
      this.userView = {};
      this.userEditView = {};
      this.headerView = new HeaderView();
      // cached elements
      this.elms = {
        'page-content': $('.page-content') // the class of the main section in index.html
      };
      $('header').hide().html(this.headerView.render().el).fadeIn('slow');
      $('footer').fadeIn('slow');
    },
    home: function() {
      this.headerView.select('home-menu');

      if (!this.homeView) {
        this.homeView = new HomeView();
      }
      this.elms['page-content'].html(this.homeView.render().el);
    },
    showUsers: function() {
      var that = this;

      this.headerView.select('list-menu');

      if (!this.userListView) {
        this.userListView = new UserListView();
      }
      this.userListView.render(function() {
        that.elms['page-content'].html(that.userListView.el);
      });
    },
    showUser: function(id) {
      var that = this, view;

      this.headerView.select();

      // pass _silent to bypass validation to be able to fetch the model
      model = new User({ _id: id, _silent: true });
      model.fetch({
        success : function(model) {
          model.unset('_silent');

          view = new UserView({ model: model });
          that.elms['page-content'].html(view.render().el);
          view.model.on('delete-success', function() {
            delete view;
            that.navigate('users', { trigger: true });
          });
        },
        error   : function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      });
    },
    addUser: function() {
      var that = this, model, view;

      this.headerView.select('new-menu');

      model = new User();
      view  = new UserEditView({ model: model });

      this.elms['page-content'].html(view.render().el);
      view.on('back', function() {
        delete view;
        that.navigate('#/users', { trigger: true });
      });
      view.model.on('save-success', function(id) {
        delete view;
        that.navigate('#/users/' + id, { trigger: true });
      });
    },
    editUser: function(id) {
      var that = this, model, view;

      this.headerView.select();

      // pass _silent to bypass validation to be able to fetch the model
      model = new User({ _id: id, _silent: true });
      model.fetch({
        success : function(model) {
          model.unset('_silent');

          // Create & render view only after model has been fetched
          view = new UserEditView({ model: model });
          that.elms['page-content'].html(view.render().el);
          view.on('back', function() {
            delete view;
            that.navigate('#/users/' + id, { trigger: true });
          });
          view.model.on('save-success', function() {
            delete view;
            that.navigate('#/users/' + id, { trigger: true });
          });
        },
        error   : function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      });

    },
    defaultAction: function(actions) {
      // No matching route, log the route?
    }
  });

  return AppRouter;
});
