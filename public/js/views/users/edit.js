/**
 * views/users/edit.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the users in templates/users/edit.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define('UserEditView', [
  'jquery',
  'underscore',
  'backbone',
  'moment',
  "myassert",
  "logToServer",
  'text!templates/users/edit.html',
  'UserModel'
], function($, _, Backbone, moment, myassert, logToServer, tpl, User) {
  var UserEditView;
  // TODO: delete var twitterIDAttr ='';
  
  UserEditView = Backbone.View.extend({
    initialize: function() {
      console.log('view/users/edit.js: initialize()');
      
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
      'click .save-btn'            : 'saveUser',
      'click .back-btn'            : 'goBack'
    }, // events
    
    render: function() {
      var tmpl, formattedBornDate = ' ', bornAttr, formattedRegisteredDate = ' ', dateRegisteredAttr;
      console.log('view/users/edit.js: render()');

      // store value of non-editable fields for use by save function
  // TODO: delete       twitterIDAttr = this.model.get('twitterID');
  // TODO: delete       console.log('view/users/edit.js: existing twitterID= '+this.model.get('twitterID'));
      
      bornAttr = this.model.get('born');
      formattedBornDate = moment(new Date(bornAttr)).format('MM/DD/YYYY');

      dateRegisteredAttr = this.model.get('dateRegistered');
      formattedRegisteredDate = moment(new Date(dateRegisteredAttr)).format('MM/DD/YYYY');

      tmpl = this.template({ user: this.model.toJSON(), formattedBornDate: formattedBornDate, formattedRegisteredDate: formattedRegisteredDate });
      $(this.el).html(tmpl);

      return this;
    }, // render
    
    goBack: function(e) {
      console.log('view/users/edit.js: goBack()');
      e.preventDefault();
      this.trigger('back');
    }, // goBack
    
    saveUser: function(e) {
      console.log('view/users/edit.js: saveUser()');
      // TODO: add other fields
      var userName, password, isAdmin, isRecorder, fullName, dateRegistered, born, email, country, city, timezone, homeTeam, favSecondTeam, that; 

      e.preventDefault();

      that    = this;
      
      userName     = $.trim($('#username-input').val());
      console.log('view/users/edit.js: userName= '+userName);
      password     = $.trim($('#password-input').val());
      console.log('view/users/edit.js: password= '+password);
      isAdmin      = $('#isadmin-input').val();
      console.log('view/users/edit.js: isadmin= '+isAdmin);
      isRecorder   = $('#isrecorder-input').val();
      console.log('view/users/edit.js: isRecorder= '+isRecorder);
      fullName     = $.trim($('#fullname-input').val());
      console.log('view/users/edit.js: fullName= '+fullName);
      email        = $.trim($('#email-input').val());
      console.log('view/users/edit.js: email= '+email);
      
//    TODO: - add any other fields

      dateRegistered = $.trim($('#dateregistered-input').val());

      if (dateRegistered) {
        dateRegistered = moment(dateRegistered, 'MM/DD/YYYY').valueOf();
      } else {
        dateRegistered = moment(); // today
      }
      console.log('view/users/edit.js: dateRegistered= '+dateRegistered);

      
      born    = $.trim($('#born-input').val());

      if (born) {
        born = moment(born, 'MM/DD/YYYY').valueOf();
      } else {
        born = null;
      }
      console.log('view/users/edit.js: born= '+born);

      country         = $.trim($('#country-input').val());
      console.log('view/users/edit.js: country= '+country);
      city            = $.trim($('#city-input').val());
      console.log('view/users/edit.js: city= '+city);
      timezone        = $.trim($('#timezone-input').val());
      console.log('view/users/edit.js: timezone= '+timezone);
      homeTeam        = $.trim($('#hometeam-input').val());
      console.log('view/users/edit.js: homeTeam= '+homeTeam);
      favSecondTeam   = $.trim($('#favsecondteam-input').val());
      console.log('view/users/edit.js: favSecondTeam= '+favSecondTeam);

      this.model.save({
        userName      : userName,
        password      : password,
        isAdmin       : isAdmin, 
        isRecorder    : isRecorder, 
        fullName      : fullName,
        
        email         : email,
        dateRegistered: dateRegistered,
        born          : born,
        country       : country,
        city          : city,
        timezone      : timezone,
        homeTeam      : homeTeam,
        favSecondTeam : favSecondTeam
        // any fields not changed/editable will not be altered by backbone
      }, {
        silent  : false,
        sync    : true,
        success : function(model, res) {
          if (res && res.errors) {
            console.log('view/users/edit.js: success(but errors reported): save failed');
            that.renderErrMsg(res.errors);
          } else {
            console.log('view/users/edit.js: triggering save-success');
            model.trigger('save-success', model.get('_id'));
          }
        },
        error: function(model, res) {
          console.log('view/users/edit.js: error: save failed');
          if (res && res.errors) {
            that.renderErrMsg(res.errors);
          } else if (res.status === 404) {
            // TODO: handle 404 Not Found
            console.log("view/users/edit.js: editUser: save failed - 404 not found");
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
            console.log("view/users/edit.js: editUser: save failed - 500 internal server error");
          }

        }
      });
    }, // saveUser
    
    renderErrMsg: function(err) {
      var msgs = [];

      this.removeErrMsg();

      if (_.isString(err)) {
        msgs.push(err);
      } else {
        if (err.general) {
          msgs.push(err.general);
          delete err.general;
        }
        if (_.keys(err).length) {
          msgs.push(_.keys(err).join(', ') + ' field(s) are invalid');
        }
      }
      msgs = _.map(msgs, function(string) {
        // uppercase first letter
        return string.charAt(0).toUpperCase() + string.slice(1);
      }).join('.');
      $(this.el).find('form').after(this.errTmpl({ msg: msgs }));
    }, // renderErrMsg
    
    removeErrMsg: function() {
      $(this.el).find('.alert-error').remove();
    } // removeErrMsg
  }); // Backbone.View.extend

  return UserEditView;
}); // define
