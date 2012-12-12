/**
 * about.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template in about.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define('AboutView', [
  'jquery',
  'underscore',
  'backbone',
  'text!templates/about.html'
], function($, _, Backbone, tpl) {
  var AboutView;

  AboutView = Backbone.View.extend({

    // the Element ID in index.html were we temporarily write the modal content from about.html into the DOM
    el: $('#modal'),
    
    // the Element ID for the modal window defined in about.html
    aboutModalEl: $('#myAboutModal'),

    // Constructor
    initialize: function () {
      if (DEBUG) console.log('about.js: initialize');
    },
    
    events: {
            'click #close': 'onCloseClick'
    },

    onCloseClick: function() {
            if (DEBUG) console.log('about.js: onCloseClick');
            
            $('#myAboutModal').modal('hide');  // close the window
            $(this.el).html(''); 
//            this.el.remove();                 // remove the about html from the DOM ?
//            this.undelegateEvents();
    },
   
    render: function() {
      var self = this;
      if (DEBUG) console.log('about.js: render '+$(self.el) );
      
      if (!self.template) {
          self.template = _.template(tpl);
          $(self.el).html(self.template);     
      } else {
        if (DEBUG) console.log('about.js: template already loaded. setting #modal html');
        $(self.el).html(self.template);
      }
       $('#myAboutModal').modal();
      
      return this;
    }
    
  });

  return AboutView;
});
