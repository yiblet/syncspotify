'use strict';

var serverClient = require('./serverInterface.js')();
var spotClient = require('./spot.js')();

serverClient.listen(function (body) {
  console.log(body);
  if (body.mode == 'play') {
    spotClient.play(body.uri);
  } else if (body.mode == 'pause') {
    spotClient.pause();
  } else {
    spotClient.resume();
  }
});

