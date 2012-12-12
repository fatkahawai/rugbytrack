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
  'moment',
  'myassert',
  'logToServer',
  // === VIEWS ===
  'HomeView',
  'HeaderView',
  // TODO: add class name of other views here
  'AboutView',
  'SigninView',
  'ContactView',
  'FieldView',
  
  'UserListView',
  'UserView',
  'UserEditView',
  'UserModel',

  'SessionListView',
  'SessionModel',

  'TeamListView',
  'TeamView',
  'TeamEditView',
  'TeamModel',

  'GameListView',
  'GameView',
  'GameEditView',
  'GameModel',

  'EventListView',
  'EventView',
  'EventEditView',
  'EventModel'
], function($, _, Backbone, moment, myassert, logToServer,
            HomeView, HeaderView, 
            // TODO: add class name of any other views here
            AboutView, SigninView, ContactView, FieldView,
            UserListView, UserView, UserEditView, User,
            SessionListView, Session,
            TeamListView, TeamView, TeamEditView, Team,
            GameListView, GameView, GameEditView, Game,
            EventListView, EventView, EventEditView, Event
            ) {
  var AppRouter, initialize;

  AppRouter = Backbone.Router.extend({
    routes: {
    // URL route       : function to call
    // ----------------------------------
      ''               : 'home',           // <url> or <url>/# or <url>/home opens our home page
      'home'           : 'home',
      
      // <TODO - add routes for any other views here
// VIEW MENU
      'games'          : 'showGames',      // view list of all games recorded
      'games/:id'      : 'showField',      // view a particular game - show the field view

// ADMIN MENU
      'users'          : 'showUsers',      // show list of all users  <host>/#/users
      'users/new'      : 'addUser',
      'users/:id'      : 'showUser',
      'users/:id/edit' : 'editUser',
      
      'games/search'   : 'searchGame',       // open search dialog to search for a specific game
      'games/new'      : 'addGame',        // record a new game
      'games/:id'      : 'showField',      // view a particular game - show the field view
      'games/:id/edit' : 'editGame',       //edit a game

      'sessions'       : 'showSessions',
      'admin/teams'    : 'editTeams',
      'admin/venues'   : 'editVenues',
      'admin/commands' : 'editCommands',
      'admin/options'  : 'editOptions',

// MISC MENU ITEMS and Footer links
      'signin'         : 'showSignin',     // open log in dialog
      'profile'        : 'showProfile',    // open my profile dialog
      'signout'        : 'showSignout',    // log out current user
      'about'          : 'showAbout',      // open About dialog
      
      'contact'        : 'showContact',    // open Contact Us dialog
      'terms'          : 'showTerms',
      'privacy'        : 'showPrivacy',

      // any other action defaults to the following handler
      '*actions'    : 'defaultAction'
    }, // routes
    
    initialize: function() {
      window.activeSession = new Session();
//  window.activeSession.set({_id:'9999', userName:'', password:'', isAdmin:false, isRecorder:false});
      if (DEBUG) console.log('router.js: initialized sessionID = '+window.activeSession.get('_id'));

      
      this.userView = {};
      this.userEditView = {};
      this.headerView = new HeaderView({ model: window.activeSession});
      if (DEBUG) console.log('router.js: instantiated all Views');

      // cached elements
      this.elms = {
        'page-content': $('.page-content') // the class of the main section in index.html
      };
      var d = moment();
      console.log( 'calendar = '+d.calendar());
      myassert.ok( this.elms, 'router.js: initialize: can\'t find the id=#page-content element');
      
      $('header').hide().html(this.headerView.render().el).fadeIn('slow');
      $('footer').fadeIn('slow');
    }, // initialize
        
    home: function() {
      if(DEBUG) console.log('router.js: home');
      
      this.headerView.select('home-menu');

      if (!this.homeView) {
        this.homeView = new HomeView();
      }
      this.elms['page-content'].html(this.homeView.render().el);
    }, //home
    
    showUsers: function() {
      var that = this;
      if(DEBUG) console.log('router.js: showUsers');
      
      this.headerView.select('admin-menu'); // highlight the selected menu item 

      if (!this.userListView) {
        this.userListView = new UserListView();
      }
      this.userListView.render(function() {
        that.elms['page-content'].html(that.userListView.el);
      });
    }, // showUsers
    
    showUser: function(id) {
      var that = this, view;
      if(DEBUG) console.log('router.js: showUser: '+id);

      this.headerView.select('admin-menu');

      // pass _silent to bypass validation to be able to fetch the model
      model = new User({ _id: id, _silent: true });
      model.fetch({
        success : function(model) {
          if(DEBUG) console.log('router.js: fetched user: '+id);
          model.unset('_silent');

          view = new UserView({ model: model });
          that.elms['page-content'].html(view.render().el);
          view.model.on('delete-success', function() {
            delete view;
            that.navigate('users', { trigger: true });
          });
        }, // success
        
        error   : function(model, res) {
          if(DEBUG) console.log('router.js: showUser: fetch failed for user: '+id);
          if (res.status === 404) {
            // TODO: handle 404 Not Found
            if(DEBUG) console.log('router.js: showUser: - received a 404 not found from server');
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
            if(DEBUG) console.log('router.js: showUser: - received a 500 internal server error from server');
          }
        } // error
      }); //model.fetch
    }, // showUser
    
    addUser: function() {
      var that = this, model, view;
      if(DEBUG) console.log('router.js: addUser');

      this.headerView.select('admin-menu');

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
      if(DEBUG) console.log('router.js: editUser');

      this.headerView.select('admin-menu');

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
            if(DEBUG) console.log('router.js: editUser: fetch failed - 404 not found');
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
            if(DEBUG) console.log('router.js: editUser: fetch failed - 500 internal server error');
          }
        } // error
      }); // model.fetch
    }, // editUser
    
    showField: function() {
      if(DEBUG) console.log('router.js: showField');
      
      this.headerView.select('game-menu'); // highlight the selected menu item 
      
      // don't open a new page, just replace the content section on our page with the field.html content       
      if (!this.fieldView) {
        if(DEBUG) console.log('router.js: instantiating fieldView object for first time');
        this.fieldView = new FieldView();
      }
      this.elms['page-content'].html(this.fieldView.render().el); // TODO: pass the game ID to the render method
    }, // showField

    showSessions: function() {
      var that = this;
      if(DEBUG) console.log('router.js: showSessions');
      
      this.headerView.select('admin-menu'); // highlight the selected menu item 

      if (!this.sessionListView) {
        this.sessionListView = new SessionListView();
      }
      this.sessionListView.render(function() {
        that.elms['page-content'].html(that.sessionListView.el);
      });
    }, // showSessions

    showGames  : function() {    // TODO: complete this
      if(DEBUG) console.log('router.js: showGames');
    }, // showGames
    
    searchGame   : function() {    // TODO: complete this
      if(DEBUG) console.log('router.js: searchGame');
    }, // searchGame

    addGame    : function() {    // TODO: complete this
      if(DEBUG) console.log('router.js: addGame');
    }, // addGame

    editGame   : function() {    // TODO: complete this
         
      if(DEBUG) console.log('router.js: editGame');
    }, // editGame
/*
 * SETTINGS MENU ITEMS
 */
    showProfile: function() {      // TODO: complete this
      if(DEBUG) console.log('router.js: showProfile');
    }, // showProfile

    showSignin: function() {
      if(DEBUG) console.log('router.js: showSignin');
      
      // open a modal dialog
      if (!this.signinView) {
        this.signinView = new SigninView();
      }
      this.signinView.render();
    }, // showSignin
    
    showSignout: function() {  // TODO: complete this
      if(DEBUG) console.log('router.js: showSignout');
      window.activeSession.set({userName:'',password:'',startDate: null, isAdmin:false,isRecorder:false}) ;
      window.activeSession.save();
      
    }, // showSignout

/*
 * MISC MENU ITEMS AND COMMANDS
 */
    showAbout: function() {
      if(DEBUG) console.log('router.js: showAbout');
      
      var activeMenu = this.headerView.currentActive();
      if(DEBUG) console.log('router.js: showAbout. activeMenu= '+activeMenu);

      // open a modal dialog
      if (!this.aboutView) {
        this.aboutView = new AboutView();
      }
      this.aboutView.render();

    }, // showAbout

    showContact: function() {
      var that = this;
      if(DEBUG) console.log('router.js: showContact');
      

//      this.headerView.select('contact-menu'); // highlight the selected menu item 
      
      // don't open a new page, just replace the content section on our page with the contact.html content       
      // or  use backbone.bootstrap-model library to open a modal dialog

//      that.elms['page-content'].html('<p>default</p>'); // remove the previous content section to be sure its gone?

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

    showTerms: function() {  // TODO: complete this
      if(DEBUG) console.log('router.js: showTerms');
    }, // showTerms

    showPrivacy: function() {  // TODO: complete this
      if(DEBUG) console.log('router.js: showPrivacy');
    }, // showPrivacy
    
    defaultAction: function(actions) {
      // No matching route, log the route?
      console.log('router.js: unmatched route. action='+actions);
//      Backbone.history.navigate('');
    }
  }); // Backbone.Router.extend

  return AppRouter;
}); // define
