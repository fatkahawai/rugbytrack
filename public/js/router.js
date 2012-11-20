/**
 * router.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * backbone Router module for the CLIENT-side application of RugbyTrack.
 * uses backbone.js MVC framework, which depends on the underscore.js utility library.
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define('Router', [
  'jquery',
  'underscore',
  'backbone',
  'HomeView',
  'HeaderView',
  // TODO: add other views 
  'AboutView',
  
  'UserListView',
  'UserView',
  'UserEditView',
  'UserModel'
], function($, _, Backbone, HomeView, HeaderView, AboutView, UserListView, UserView, UserEditView, User) {
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
      'contact' : 'showContact',
      'about' : 'showAbout',
      
      // any other action defaults to the following handler
      '*actions'    : 'defaultAction'
    }, // routes
    
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
    }, // initialize
    
    home: function() {
      this.headerView.select('home-menu');

      if (!this.homeView) {
        this.homeView = new HomeView();
      }
      this.elms['page-content'].html(this.homeView.render().el);
    }, //home
    
    showUsers: function() {
      var that = this;
      console.log("router.js: showUsers");
      
      this.headerView.select('list-menu'); // highlight the selected menu item 

      if (!this.userListView) {
        this.userListView = new UserListView();
      }
      this.userListView.render(function() {
        that.elms['page-content'].html(that.userListView.el);
      });
    }, // showUsers
    
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
        }, // success
        
        error   : function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        } // error
      }); //model.fetch
    }, // showUser
    
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
    }, // addUser
    
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
        }, // success
        error   : function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        } // error
      }); // model.fetch
    }, // editUser
    
    showAbout: function() {
      var that = this;
      console.log("router.js: showAbout");
      
      this.headerView.select('about-menu'); // highlight the selected menu item 
      that.elms['page-content'].html("<p>default</p>"); // remove the previous content section

      if (!this.aboutView) {
        this.aboutView = new AboutView();
      }
      // this works
      this.elms['page-content'].html(this.aboutView.render().el);
/*    but this original code doesn't....
        this.aboutView.render(function() {
        that.elms['page-content'].html(that.aboutView.el);
      });
*/
    }, // showAbout
    

    defaultAction: function(actions) {
      // No matching route, log the route?
      console.log("router.js: unmatched route. actions="+actions);
    }
  }); // Backbone.Router.extend

  return AppRouter;
}); // define
