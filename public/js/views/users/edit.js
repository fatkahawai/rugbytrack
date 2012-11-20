/**
 * users/edit.js
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
      "focus .input-prepend input" : "removeErrMsg",
      "click .save-btn"            : "saveUser",
      "click .back-btn"            : "goBack"
    }, // events
    
    render: function() {
      var tmpl, formattedDate = ' ', bornAttr;

      bornAttr = this.model.get('born');
      formattedDate = moment(new Date(bornAttr)).format("MM/DD/YYYY");

      tmpl = this.template({ user: this.model.toJSON(), formattedDate: formattedDate });
      $(this.el).html(tmpl);

      return this;
    }, // render
    
    goBack: function(e) {
      e.preventDefault();
      this.trigger('back');
    }, // goBack
    
    saveUser: function(e) {
      var name, born, email, that; // <TODO: add other fields>

      e.preventDefault();

      that    = this;
      name    = $.trim($('#name-input').val());
      email   = $.trim($('#email-input').val());
//      <TODO: - add other fields> = $.trim($('#<TODO: add other fields>-input').val());
      born    = $.trim($('#born-input').val());

      if (born) {
        born = moment(born, 'MM/DD/YYYY').valueOf();
      } else {
        born = null;
      }

      this.model.save({
        name    : name,
        email   : email,
//        <TODO - add other fields> : <TODO - add other fields>,
        born    : born
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
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
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
