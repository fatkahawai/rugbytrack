/**
* @author Bob Drummond
* 
* MYASSERT.JS
* 
* @version 1.0
* @see
* @throws none
* 
* INTEGRATING THE MODULE 
* include <script src='js/lib/myassert.js'></script> in your html file
* 
* USE 
*   myassert.ok( someVar >0 , 'expected someVar to be > 0' );
*
* (c) 2012 Pink Pelican Ltd 
*/

// namespace envelope function to restrict scope of debug attributes 
//
(function (Boolean, String) {

'use strict'; 

var isEnabled        = false;

var displayInWindow  = false;   // default settings
var displayInConsole = true;
var displayInAlert   = false;

var outputElement = document.getElementById('assert-output'); // find the <ul> element marked '#assert-output'

// check for nodeJS
var hasModule = (typeof module !== 'undefined');


/* 
 * myassert method.
 * 
 * @param Boolean condition -  the condition to test for thuthy 
 * @param string errorMsg   -  the message to log if condition is not true
 *
 * @return Boolean result of test
 */
var myassert;

  myassert = function( condition, errorMsg ) {
    myassert.ok( condition, errorMsg );  
  };
  
  myassert.ok = function(
               condition,   
               errorMsg){
  var msg = 'Assert FAILED: '+errorMsg;

  if ( isEnabled ) {
    if ( displayInWindow )
    {
      var li = document.createElement('li');  
      li.className = condition ? 'pass' : 'fail';  
      li.appendChild( document.createTextNode( errorMsg ) );  
      outputElement.appendChild(li);  
    }

    if( !condition ) // failed
    {
      if (displayInConsole){
        console.log(msg);
      }
      if ( displayInAlert ){    
         alert(msg);
      }
    } // if fail
  }
};

/*
 * Getters and setters
 */
myassert.enable = function( ) {
  isEnabled = true;
  return true;
};

myassert.disable = function( ) {
  isEnabled = false;
  return false;
};

myassert.setDisplayInWindow = function( val ) {
  if (val){
    displayInWindow = true;
    isEnabled = true;
    var li = document.createElement('li');  
    li.appendChild( document.createTextNode( 'myassert results:' ) );  
    outputElement.appendChild(li);  
  }
  else
    displayInWindow = false;
  return displayInWindow;
};

myassert.setDisplayInConsole = function( val ) {
  if (val){
    displayInConsole = true;
    isEnabled = true;
  }
  else
    displayInConsole = false;
  return displayInConsole;
};

myassert.setDisplayInAlert = function( val ) {
  if (val){
    displayInAlert = true;
    isEnabled = true;
  }
  else
    displayInAlert = false;
  return displayInAlert;
};


  // Export module interface ************
    // CommonJS module is defined
    if (hasModule) {
        module.exports = myassert;
    }
    /*global ender:false */
    if (typeof window !== 'undefined' && typeof ender === 'undefined') {
        window.myassert = myassert;
    }
    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define('myassert', [], function () {
            return myassert;
        });
    }
})(Boolean, String);

