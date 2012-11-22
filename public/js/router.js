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
  // TODO: add class name of other views here
  'AboutView',
  'SigninView',
  'ContactView',
  
  'UserListView',
  'UserView',
  'UserEditView',
  'UserModel'
], function($, _, Backbone, 
            HomeView, HeaderView, 
            // TODO: add class name of any other views here
            AboutView, SigninView, ContactView, 
            UserListView, UserView, UserEditView, User) {
  var AppRouter, initialize;

  AppRouter = Backbone.Router.extend({
    routes: {
      ''            : 'home',
      'home'        : 'home',
      
      // <TODO - add routes for any other views here
      'contact'   : 'showContact',
      'about'     : 'showAbout',
      'signin'    : 'showSignin',
      
      'users'     : 'showUsers', // /#/users
      'users/new' : 'addUser',
      'users/:id' : 'showUser',
      'users/:id/edit' : 'editUser',
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
      console.log("router.js: home");
      
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
      console.log("router.js: showAbout");
      
      var activeMenu = this.headerView.currentActive();
      console.log("router.js: showAbout. activeMenu= "+activeMenu);

//      this.headerView.select('about-menu'); // highlight the selected menu item 
      
      // open a modal dialog
      if (!this.aboutView) {
        this.aboutView = new AboutView();
      }
      this.aboutView.render();

      this.headerView.select(activeMenu); // highlight the selected menu item 
      Backbone.history.navigate("");

    }, // showAbout
    

    showSignin: function() {
      console.log("router.js: showSignin");
      
      var activeMenu = this.headerView.currentActive();
      console.log("router.js: showSignin. activeMenu= "+activeMenu);
      
      // open a modal dialog
      if (!this.signinView) {
        this.signinView = new SigninView();
      }
      this.signinView.render();

      this.headerView.select(activeMenu); // highlight the selected menu item 
      Backbone.history.navigate("");

    }, // showSignin
    
    showContact: function() {
      var that = this;
      console.log("router.js: showContact");
      

      this.headerView.select('contact-menu'); // highlight the selected menu item 
      
      // don't open a new page, just replace the content section on our page with the contact.html content       
      // or  use backbone.bootstrap-model library to open a modal dialog

//      that.elms['page-content'].html("<p>default</p>"); // remove the previous content section to be sure its gone?

      if (!this.contactView) {
        this.contactView = new ContactView();
      }
      // this works
      this.elms['page-content'].html(this.contactView.render().el);
/*    but this original code doesn't....
        this.contactView.render(function() {
        that.elms['page-content'].html(that.contactView.el);
      });
*/
    }, // showContact
    
    defaultAction: function(actions) {
      // No matching route, log the route?
      console.log("router.js: unmatched route. actions="+actions);
      Backbone.history.navigate("");
    }
  }); // Backbone.Router.extend

  return AppRouter;
}); // define
