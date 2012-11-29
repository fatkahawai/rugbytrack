/**
 * views/events/edit.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the events in templates/events/edit.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("EventEditView", [
  "jquery",
  "underscore",
  "backbone",
  "moment",
  "myassert",
  "text!templates/events/edit.html",
  "EventModel"
], function($, _, Backbone, moment, myassert, tpl, Event) {
  var EventEditView;

  EventEditView = Backbone.View.extend({
    initialize: function() {
      console.log("view/events/edit.js: initialize()");
      
      this.template = _.template(tpl);

      this.errTmpl  = "<div class='span4'>";
      this.errTmpl += "<div class='alert alert-error'>";
      this.errTmpl += "<button type='button' class='close' data-dismiss='alert'>x</button>";
      this.errTmpl += "<%- msg %>";
      this.errTmpl += "</div>";
      this.errTmpl += "</div>";
      this.errTmpl = _.template(this.errTmpl);
    }, // initialize
    
    events: {
      "focus .input-prepend input" : "removeErrMsg",
      "click .save-btn"            : "saveEvent",
      "click .back-btn"            : "goBack"
    }, // events
    
    render: function() {
      var tmpl;
      console.log("view/events/edit.js: render()");

      tmpl = this.template({ event: this.model.toJSON() });
      $(this.el).html(tmpl);

      return this;
    }, // render
    
    goBack: function(e) {
      console.log("view/events/edit.js: goback()");
      e.preventDefault();
      this.trigger("back");
    }, // goBack
    
    saveEvent: function(e) {
      var eventID, eventType, eventParam, game, elapsedSeconds, possession, positionX, positionY, player, recordingUser, that; // <TODO: add other fields>
      console.log("view/events/edit.js: goback()");

      e.preventDefault();

      that    = this;
      eventID         = $.trim($("#eventid-input").val());
      eventType       = $.trim($("#eventtype-input").val());
      game            = $.trim($("#game-input").val());
      elapsedSeconds  = $.trim($("#elapsedseconds-input").val());
      possession      = $.trim($("#possession-input").val());
      positionX       = $.trim($("#positionx-input").val());
      positionY       = $.trim($("#positiony-input").val());
      player          = $.trim($("#player-input").val());
      recordingUser   = $.trim($("#recordinguser-input").val());


      this.model.save({
        eventID        : eventID,
        eventType      : eventType,
        game           : game,
        elapsedSeconds : elapsedSeconds,
        possession     : possession,
        positionX      : positionX,
        positionY      : positionY,
        player         : player,
        recordingUser  : recordingUser
      }, {
        silent  : false,
        sync    : true,
        success : function(model, res) {
          if (res && res.errors) {
            that.renderErrMsg(res.errors);
          } else {
            model.trigger("save-success", model.get("_id"));
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
    }, // saveEvent
    
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
          msgs.push(_.keys(err).join(", ") + " field(s) are invalid");
        }
      }
      msgs = _.map(msgs, function(string) {
        // uppercase first letter
        return string.charAt(0).toUpperCase() + string.slice(1);
      }).join(".");
      $(this.el).find("form").after(this.errTmpl({ msg: msgs }));
    }, // renderErrMsg
    
    removeErrMsg: function() {
      $(this.el).find(".alert-error").remove();
    } // removeErrMsg
  }); // Backbone.View.extend

  return EventEditView;
}); // define
