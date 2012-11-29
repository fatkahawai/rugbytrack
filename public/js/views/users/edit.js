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
  'text!templates/users/edit.html',
  'UserModel'
], function($, _, Backbone, moment, tpl, User) {
  var UserEditView;

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
      var userName, password, fullName, dateRegistered, born, email, country, city, timezone, homeTeam, favSecondTeam, that; 

      e.preventDefault();

      that    = this;
      
      userName    = $.trim($('#username-input').val());
      password    = $.trim($('#password-input').val());
      fullName    = $.trim($('#fullname-input').val());
      email       = $.trim($('#email-input').val());
      
//    TODO: - add any other fields

      dateRegistered    = $.trim($('#dateregistered-input').val());

      if (dateRegistered) {
        dateRegistered = moment(dateRegistered, 'MM/DD/YYYY').valueOf();
      } else {
        dateRegistered = moment(); // today
      }

      
      born    = $.trim($('#born-input').val());

      if (born) {
        born = moment(born, 'MM/DD/YYYY').valueOf();
      } else {
        born = null;
      }

      country         = $.trim($('#country-input').val());
      city            = $.trim($('#city-input').val());
      timezone        = $.trim($('#timezone-input').val());
      homeTeam        = $.trim($('#hometeam-input').val());
      favSecondTeam   = $.trim($('#favsecondteam-input').val());

      this.model.save({
        userName      : userName,
        password      : password,
        fullName      : fullName,
        
        email         : email,
//        <TODO - add other fields> : <TODO - add other fields>,
        dateRegistered: dateRegistered,
        born          : born,
        country       : country,
        city          : city,
        timezone      : timezone,
        homeTeam      : homeTeam,
        favSecondTeam : favSecondTeam
      }, {
        silent  : false,
        sync    : true,
        success : function(model, res) {
          if (res && res.errors) {
            that.renderErrMsg(res.errors);
          } else {
            model.trigger('save-success', model.get('_id'));
          }
        },
        error: function(model, res) {
          if (res && res.errors) {
            that.renderErrMsg(res.errors);
          } else if (res.status === 404) {
            // TODO: handle 404 Not Found
            if(DEBUG) console.log("router.js: editUser: fetch failed - 404 not found");
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
            if(DEBUG) console.log("router.js: editUser: fetch failed - 500 internal server error");
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
