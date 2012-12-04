/**
 * LOGTOSERVER.JS
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 *
 * MODULE: logtoserver
 * 
 * INTEGRATING THIS MODULE:
 * include <script src='js/lib/logtoserver.js'></script> in your html file
 * 
 * USE:
 * usage: 
 *   for jQuery or DOM errors
 *   window.onerror = function(message, file, line) {
 *     logtoserver.post(file + ':' + line + ' #error #window_error ' + message); 
 *   };
 * 
 *   for ajax errors
 *   $(document).ajaxError(function(e, xhr, settings) {
 *     logtoserver.post(settings.url + ':' + xhr.status + ' #error #ajax_error ' + xhr.responseText);
 *   });
 * 
 *   general
 *   logtoserver.post('can't find cookie #cookie_error #disk_free_space=22 #warning');
 * 
 * server-side apps:
 * syslog.js  - saves the incoming logs to disk raw
 * hashmonitor (https://github.com/olark/hashmonitor)  - parses message for hashtags and calculates stats
 * tinyfeedback (https://github.com/steiza/tinyfeedback) - to display stats, trendlines
 * 
 * @throws none
 * @see any refs ?
 * 
 * @author Bob Drummond
 * (C) 2012 PINK PELICAN NZ LTD
 */


// namespace envelope function to restrict scope of attributes 
// the arguments are the types of the function arguments
//
(function (String) {

  'use strict'; 

  var APPDOMAIN = 'localhost';
  var APPAPI = '/api/v1';
  
  var logCount = 0;
  var MAXLOGCOUNT = 100;
  
  //  check for nodeJS
  var hasModule = (typeof module !== 'undefined');

  var logtoserver; // the function we will export


/**
 * logtoserver Method.
 * 
 * @param string details -  description of error, including any hashtags
 *
 * @return void
 */
  logtoserver = function(
                   details) {
    // avoid overload
    if  (++logCount > MAXLOGCOUNT ) {
      console.log("logtoserver: max log count reached. logging to server terminated");
    }
    else{
      console.log("logtoserver: "+details);
      $.ajax({
        type: 'POST',
        url: 'http://'+APPDOMAIN+APPAPI+'/errors',
        data: JSON.stringify({context: navigator.userAgent, details: details}),
        contentType: 'application/json; charset=utf-8'
      });
    } // if
  }; // logtoserver
  
  // **********************************************
  // Export logToServer interface = all public functions
  // CommonJS module is defined
  if (hasModule) {
    module.exports = logtoserver;
  }
  /*global ender:false */
  if (typeof window !== 'undefined' && typeof ender === 'undefined') {
    window.logtoserver = logtoserver;
  }
  /*global define:false */
  if (typeof define === 'function' && define.amd) {
    define('logtoserver', [], function () {
      return logtoserver;
    });
  }
})(String);

