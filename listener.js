var serverClient = require('./serverInterface.js')();
var spotClient = require('./spot.js')();

serverClient.listen((mode, body) => {
  console.log(mode, body);
  if (mode == 'play') {
    spotClient.play(body.uri);
  } else if (mode == 'pause') {
    spotClient.pause();
  } else {
    spotClient.resume();
  }
});
