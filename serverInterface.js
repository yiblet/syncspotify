'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request');
var sock = require('socket.io-client');
var url = 'http://sync.yiblet.me';
// var url = 'http://localhost:24223'

var ServerClient = function () {
  function ServerClient() {
    _classCallCheck(this, ServerClient);
  }

  _createClass(ServerClient, [{
    key: 'play',
    value: function play(uri) {
      var cb = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

      console.log('play', uri);
      var options = {
        url: url + '/play/' + uri
      };
      request(options, function (err, resp, body) {
        if (err) {
          throw err;
        }
        return cb(body);
      });
    }
  }, {
    key: 'pause',
    value: function pause() {
      var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

      console.log('pause');
      var options = {
        url: url + '/pause'
      };
      request(options, function (err, resp, body) {
        if (err) {
          throw err;
        }
        return cb(body);
      });
    }
  }, {
    key: 'resume',
    value: function resume() {
      var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

      console.log('resume');
      var options = {
        url: url + '/resume'
      };
      request(options, function (err, resp, body) {
        if (err) {
          throw err;
        }
        return cb(body);
      });
    }
  }, {
    key: 'listen',
    value: function listen(cb) {
      var newCb = function newCb(mode) {
        return function (data) {
          return cb(mode, data);
        };
      };
      var client = sock(url);
      client.on('play', newCb('play'));
      client.on('pause', newCb('pause'));
      client.on('resume', newCb('resume'));
    }
  }]);

  return ServerClient;
}();

module.exports = function () {
  return new ServerClient();
};

