/**
 * views/teams/edit.js
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 * Backbone View module for the CLIENT-side application of RugbyTrack.
 * renders the template for the teams in templates/teams/edit.html
 * 
 * @throws none
 * @see 
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */

define("TeamEditView", [
  "jquery",
  "underscore",
  "backbone",
  "moment",
  "text!templates/teams/edit.html",
  "TeamModel"
], function($, _, Backbone, moment, tpl, Team) {
  var TeamEditView;

  TeamEditView = Backbone.View.extend({
    initialize: function() {
      console.log("view/teams/edit.js: initialize()");
      
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
      "click .save-btn"            : "saveTeam",
      "click .back-btn"            : "goBack"
    }, // events
    
    render: function() {
      var tmpl;
      console.log("view/teams/edit.js: render()");

      tmpl = this.template({ team: this.model.toJSON() });
      $(this.el).html(tmpl);

      return this;
    }, // render
    
    goBack: function(e) {
      console.log("view/teams/edit.js: goBack()");
      e.preventDefault();
      this.trigger("back");
    }, // goBack
    
    saveTeam: function(e) {
      console.log("view/teams/edit.js: saveTeam()");
      // TODO: add other fields
      var teamName, that; 

      e.preventDefault();

      that    = this;
      
      teamName    = $.trim($("#teamname-input").val());
      
//    TODO: - add any other fields


      this.model.save({
        teamName      : teamName
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
    }, // saveTeam
    
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

  return TeamEditView;
}); // define
