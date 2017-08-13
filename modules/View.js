/*
  Very simple View implementation for outputting results
    to the console ...
*/
'use strict';

class View {
  static outputResults (data) {
    console.log (JSON.stringify (data, null, 2));
  }
  static error (data) {
    console.error (" --** ERROR ::: ", data, " ::: **--");
  }
}

module.exports.View = View;
