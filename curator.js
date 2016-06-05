var spot = require('./spot.js');
var serverInterface =  require('./serverInterface.js');
var spotClient = spot();
var serverClient = serverInterface();

var isPaused = false;
var pastPlayingPosition = -1;
var currentTrack = ''
var lastStatus = 0;

var getTrack = (body) => {
  return body.track.track_resource.uri;
}

var getIsPaused = (body) => {
  return !body.playing;
}

var getPlayingPosition = (body) => {
  return body.playing_position;
}

var secondsSinceLastStatus = () => {
  return (Date.now() - lastStatus) / 1000
}

var  parseBody = (body) => {
  var newIsPaused = getIsPaused(body);
  var newPastPlayingPosition = getPlayingPosition(body);
  var newCurrentTrack = getTrack(body);
  // console.log(body)
  if (newPastPlayingPosition <= 2 || newCurrentTrack != currentTrack) {
    serverClient.play(newCurrentTrack);
  } else if (Math.abs(newPastPlayingPosition - pastPlayingPosition) <= 1
    && isPaused && !newIsPaused && newCurrentTrack == currentTrack) {
    serverClient.resume();
  } else if (! isPaused && newIsPaused && currentTrack == newCurrentTrack) {
    serverClient.pause();
  } else if (secondsSinceLastStatus() < 60) {
    console.log('unexpected user pattern, stop being weird', body);
  }

  currentTrack = newCurrentTrack;
  isPaused = newIsPaused;
  pastPlayingPosition = newPastPlayingPosition;
  lastStatus = Date.now();
}


var recur = (body) => {
  parseBody(body)
  spotClient.stat(recur);
}

spotClient.stat(recur);
