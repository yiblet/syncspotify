var request = require('request');
var sock =  require('socket.io-client');
// var url = 'sync.yiblet.me';
var url = 'http://localhost:24223'

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
    var client = sock('localhost:24223');
    client.on('event', cb);
  }
}

module.exports = () => {
  return new ServerClient();
}
