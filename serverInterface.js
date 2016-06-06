var request = require('request');
var sock =  require('socket.io-client');
var url = 'http://sync.yiblet.me';
// var url = 'http://localhost:24223'

class ServerClient {
  constructor(){
  }

  play(uri, cb = () => {}){
    console.log('play', uri)
    var options = {
      url : url + '/play/' + uri
    };
    request(options, (err, resp, body) => {
      if (err) {
        throw err;
      }
      return cb(body);
    })
  }

  pause(cb = () => {}){
    console.log('pause')
    var options = {
      url : url + '/pause'
    };
    request(options, (err, resp, body) => {
      if (err) {
        throw err;
      }
      return cb(body);
    })
  }

  resume(cb = () => {}){
    console.log('resume')
    var options = {
      url : url + '/resume'
    };
    request(options, (err, resp, body) => {
      if (err) {
        throw err;
      }
      return cb(body);
    })
  }

  listen(cb) {
    var newCb = (mode) => {
      return (data) => {return cb(mode, data)}
    }
    var client = sock(url, {timeout : 1000000});
    client.on('play', newCb('play'));
    client.on('pause', newCb('pause'));
    client.on('resume', newCb('resume'));
  }
}

module.exports = () => {
  return new ServerClient();
}
