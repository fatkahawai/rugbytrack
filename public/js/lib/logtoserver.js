/**
 * LOGTOSERVER.JS
 * 
 * @version 1.0
 * 
 * DESCRIPTION:
 *
 * MODULE: logToServer - log client-side errors and useful usage info to a server-side Db
 * 
 * INTEGRATING THIS MODULE:
 * include <script src='js/lib/logtoserver.js'></script> in your html file
 * 
 * USE:
 * usage: 
 *   for jQuery or DOM errors
 *   window.onerror = function(message, file, line) {
 *     logToServer(file + ':' + line + ' #error #window_error ' + message); 
 *   };
 * 
 *   for ajax errors
 *   $(document).ajaxError(function(e, xhr, settings) {
 *     logToServer(settings.url + ':' + xhr.status + ' #error #ajax_error ' + xhr.responseText);
 *   });
 * 
 *   general
 *   logToServer('can\'t find cookie #cookie_error #disk_free_space=22 #warning');
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

  var APPAPI    = '/api/v1';
  var APPLOGS   = '/logs';
  var appDomain = 'localhost';  // localhost as default domain
  var appPort   = '8080';       // set development env as default port
  
  var MAXLOGCOUNT = 32;
  var logCount = 0;
  var loggingEnabled = true;
  
  //  check for nodeJS
  var hasModule = (typeof module !== 'undefined');

  var logToServer; // the function we will export


/**
 * logToServer Method.
 * 
 * @param string details -  description of error, including any hashtags
 *
 * @return void
 */
  logToServer = function(
                   details) {
    // initialize 
    if (logCount == 0){
      appDomain = document.domain;
      appPort = document.location.port;
      loggingEnabled = true;
      console.log('logtoserver: initializing on url '+'http://'+appDomain+':'+appPort+APPAPI+APPLOGS);
    }
    // avoid overload by this client in this session
    if ( loggingEnabled ) {
      if  (++logCount > MAXLOGCOUNT ) {
        console.log('logtoserver: max log count reached. logging to server terminated');
      }
      else{
        console.log('logtoserver['+logCount+']: '+details);
        $.ajax({
          type: 'POST',
          url: 'http://'+appDomain+':'+appPort+APPAPI+APPLOGS,
          data: JSON.stringify({context: navigator.userAgent, details: details}),
          contentType: 'application/json; charset=utf-8',
          success : function(data, textStatus, jqXHR) {
            console.log('DEBUG: logtoserver: successfully posted to server, status= '+textStatus);
          },
          error : function(jqXHR, textStatus, errorThrown){
            console.log('logtoserver: unable to post to server. disabling logToServer function. error: '+textStatus);
            loggingEnabled = false;
          }
        });
      } // else
    } // if enabled
  }; // logToServer
  
  // **********************************************
  // Export logToServer interface = all public functions
  // CommonJS module is defined
  if (hasModule) {
    module.exports = logToServer;
  }
  /*global ender:false */
  if (typeof window !== 'undefined' && typeof ender === 'undefined') {
    window.logToServer = logToServer;
  }
  /*global define:false */
  if (typeof define === 'function' && define.amd) {
    define('logToServer', [], function () {
      return logToServer;
    });
  }
})(String);

