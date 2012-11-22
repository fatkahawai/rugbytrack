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
  'text!templates/signin.html'
], function($, _, Backbone, tpl) {
  var SigninView;

  SigninView = Backbone.View.extend({

    // the Element ID in index.html were we temporarily write the modal content from signin.html into the DOM
    el: $('#modal'),
    
    // the Element ID for the modal window defined in signin.html
    signinModalEl: $("#mySigninModal"),

    // Constructor
    initialize: function () {
    },
    
    events: {
            "click #submit": "onSubmitClick"
    },

    onSubmitClick: function() {
            console.log("signin.js: onSubmitClick");
            
            $("#mySigninModal").modal('hide');  // close the window
            $(this.el).html(""); 
//            this.el.remove();                 // remove the signin html from the DOM ?
//            this.undelegateEvents();
    },
   
    render: function() {
      var self = this;
      console.log("signin.js: render "+$(self.el) );
      
      if (!self.template) {
          self.template = _.template(tpl);
          $(self.el).html(self.template);     
      } else {
        console.log("signin.js: template already loaded. setting #modal html");
        $(self.el).html(self.template);
      }
       $("#mySigninModal").modal();
      
      return this;
    }
    
  });

  return SigninView;
});
