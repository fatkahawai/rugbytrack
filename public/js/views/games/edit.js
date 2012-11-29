/**
 * views/games/edit.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the games in templates/games/edit.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("GameEditView", [
  "jquery",
  "underscore",
  "backbone",
  "moment",
  "text!templates/games/edit.html",
  "GameModel"
], function($, _, Backbone, moment, tpl, Game) {
  var GameEditView;

  GameEditView = Backbone.View.extend({
    initialize: function() {
      console.log("view/games/edit.js: initialize()");
      
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
      "click .save-btn"            : "saveGame",
      "click .back-btn"            : "goBack"
    }, // events
    
    render: function() {
      var tmpl;
      console.log("view/games/edit.js: render()");

      tmpl = this.template({ game: this.model.toJSON() });
      $(this.el).html(tmpl);

      return this;
    }, // render
    
    goBack: function(e) {
      console.log("view/games/edit.js: goBack()");
      e.preventDefault();
      this.trigger("back");
    }, // goBack
    
    saveGame: function(e) {
      console.log("view/games/edit.js: saveGame()");
      // TODO: add other fields
      var gameID, that; 

      e.preventDefault();

      that    = this;
      
      gameID    = $.trim($("#gameid-input").val());
      
//    TODO: - add any other fields


      this.model.save({
        gameID      : gameID
//        <TODO - add other fields> : <TODO - add other fields>,
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
    }, // saveGame
    
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

  return GameEditView;
}); // define
