/**
 * signin.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template in signin.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define('SigninView', [
  'jquery',
  'underscore',
  'backbone',
  'text!templates/signin.html',
  'UserModel',
  'SessionModel'
], function($, _, Backbone, tpl, User, Session) {
  var SigninView;

  SigninView = Backbone.View.extend({

    // the Element ID in index.html were we temporarily write the modal content from about.html into the DOM
    el: $('#modal'),
    
    // the Element ID for the modal window defined in about.html
    aboutModalEl: $('#mySigninModal'),
    
    // Constructor
    initialize: function() {
      if (DEBUG) console.log('signin.js:initialize() window.activeSession._id= '+window.activeSession.get('_id'));
      
      this.SIGNINAPI    = '/user/signin';
      
      this.template = _.template(tpl);

      this.errTmpl  = '<div class="span4">';
      this.errTmpl += '<div class="alert alert-error">';
      this.errTmpl += '<button type="button" class="close" data-dismiss="alert">x</button>';
      this.errTmpl += '<%- msg %>';
      this.errTmpl += '</div>';
      this.errTmpl += '</div>';
      this.errTmpl = _.template(this.errTmpl);

    }, // initialize
        
    events: {
            'focus .input-prepend input' : 'removeErrMsg',
            'click #submit'              : 'onSubmitClick',
            'click #rememberme-input'    : 'onCheckBoxClick'
    },

    onCheckBoxClick: function() {
            if (DEBUG) console.log('signin.js: onCheckBoxClick. remember-me val= '+$('#rememberme-input').val() );
    },
    
    onSubmitClick: function() {
            var that = this;
            
            if (DEBUG) console.log('signin.js: onSubmitClick');
            
            var userNameInput = $('#username-input').val();
            var passwordInput = $('#password-input').val();
            if (DEBUG) console.log('username= '+$('#username-input').val());
            if (DEBUG) console.log('password= '+$('#password-input').val());
            
            if( userNameInput ) { // if a username was entered
              // send the user login details to the server and see if accepted
              // the server will respond 200 if details OK, or 404 if user not known or password wrong
              $.ajax({
                type: 'POST',
                url: 'http://'+window.appDomain+':'+window.appPort+window.appAPI+this.SIGNINAPI,
                data: JSON.stringify({context: navigator.userAgent, userName: userNameInput, password: passwordInput}),
                contentType: 'application/json; charset=utf-8',
                success : function(data, textStatus, jqXHR) {
                  if (DEBUG) console.log('signin.js: user successfully authenticated by server, status= '+textStatus);

                  // TODO: now create a new session on the server, get the server-assigned unique session ID and 
                  // the session onchange eventhandler will save it into the global Session object in the wondow object 
                  var sessionDetail = {
                    _id  :  null,
                    userName   : userNameInput,
                    password   : passwordInput
                  };
                  
                  if (DEBUG) console.log('signin.js: saving new session to server to get new session id');
                  window.activeSession.save( sessionDetail, {
                    silent  : false,
                    sync    : true,
                    success : function(model, res) {
                      if (res && res.errors) {
                        if (DEBUG) console.log('signin.js: success(but errors reported): save session failed');
                        that.renderErrMsg(res.errors);
                      } else {
                        if (DEBUG) console.log('signin.js: save-success. _id= '+model.get('_id')+' user= '+model.get('userName')+' res='+JSON.stringify(res));
                        model.trigger('save-success', model.get('_id'));
                        window.activeSession.fetch();
                      }
                    },
                    error: function(model, res) {
                      if (DEBUG) console.log('signin.js: error: save session failed');
                      if (res && res.errors) {
                        that.renderErrMsg(res.errors);
                      } else if (res.status === 404) {
                        // TODO: handle 404 Not Found
                        if (DEBUG) console.log("signin.js: save session failed - 404 not found");
                      } else if (res.status === 500) {
                        // TODO: handle 500 Internal Server Error
                        if (DEBUG) console.log("signin.js: save session failed - 500 internal server error");
                      }
                    }
                  }); // newSession.save
                  
                  if (DEBUG) console.log('signin.js: remember-me val= '+$('#rememberme-input').val() ); 
                  if (DEBUG) console.log('signin.js: remember-me.attr = '+$('#rememberme-input').attr('checked') ? 1 : 0 ); 
                  // TODO: save username/pwd in a cookie if remember-me = true

                  // TODO: hide the "Sign up now" button 
                  // TODO: show username in the menu bar

                  $('#mySigninModal').modal('hide');  // close the window
                  $('#modal').html('');               // remove the signin html from the DOM
//                this.el.remove();                   // remove the signin html from the DOM ?
//                this.undelegateEvents();

                }, // user authentication success
                
                error : function(jqXHR, textStatus, errorThrown){
                  console.log('signin.js: user not known or password wrong, status= '+textStatus);
                  // display login error in Signin Modal window and allow user to retry
                  that.renderErrMsg();
                }
              }); // ajax
            }
    },
   
    render: function() {
      var self = this;
      if (DEBUG) console.log('signin.js: render #modal.');
      
      // check if a user already logged in
      if (window.activeSession.get('userName') ) {
        if (DEBUG) console.log('current logged-in user= '+window.activeSession.get('userName') );
        
      }
      if (!self.template) {
          self.template = _.template(tpl);
          $('#modal').html(self.template);     
      } else {
        if (DEBUG) console.log('signin.js: template already loaded. setting #modal html');
        $('#modal').html(self.template);
      }
       $('#mySigninModal').modal();
      
      return this;
    },

    renderErrMsg: function(err) {
      this.removeErrMsg();

      $(this.el).find('form').after(this.errTmpl({ msg: 'unknown user name or incorrect password' }));
    }, // renderErrMsg
    
    removeErrMsg: function() {
      $(this.el).find('.alert-error').remove();
    } // removeErrMsg

  }); // backbone.extend

  return SigninView;
});
