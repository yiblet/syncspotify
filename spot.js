'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var request = require('request');

var Spotify = function () {
  function Spotify() {
    _classCallCheck(this, Spotify);

    this.port = 4371;
    this.oauth_token = null;
    this.csrf_token = null;
  }

  _createClass(Spotify, [{
    key: 'getAuth',
    value: function getAuth(url, params, callback) {
      var _this = this;

      var _self = this;
      this.csrf_token = null;
      request('http://open.spotify.com/token', function (err, resp, body) {
        if (err) throw err;
        _self.oauth_token = JSON.parse(body).t;
        _self.get('/simplecsrf/token.json', null, function (body) {
          _self.csrf_token = body.token;
          _this.get(url, params, callback);
        });
      });
    }
  }, {
    key: 'generateRandomString',
    value: function generateRandomString() {
      var charset = 'abcdefghijklmnopqrstuvwxyz';
      var arr = [];
      for (var i = 0; i < 10; i++) {
        arr.push(charset.charAt(Math.floor(Math.random() * charset.length)));
      }
      return arr.join('');
    }
  }, {
    key: 'get',
    value: function get(url) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var callback = arguments.length <= 2 || arguments[2] === undefined ? function () {} : arguments[2];
      var opts = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

      if (!this.oauth_token) {
        return this.getAuth(url, params, callback);
      }

      var options = {
        //Only accepts request coming from the spotify domains
        headers: {
          Origin: 'https://open.spotify.com',
          Referer: 'https://embed.spotify.com/?uri=spotify:track:5Zp4SWOpbuOdnsxLqwgutt'
        },
        qs: {
          oauth: this.oauth_token
        },
        rejectUnauthorized: false, // #YOLO
        url: 'https://' + this.generateRandomString() + '.spotilocal.com:' + this.port + url //getting around the domain connection limit
      };

      if (this.csrf_token) options.qs.csrf = this.csrf_token;

      if (params) {
        for (var param in params) {
          options.qs[param] = params[param];
        }
      }

      if (opts) {
        for (var _param in opts) {
          options[_param] = opts[_param];
        }
      }

      request(options, function (err, resp, body) {
        if (err) throw err;
        callback(JSON.parse(body));
      });
    }
  }, {
    key: 'play',
    value: function play(uri) {
      var cb = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

      this.get('/remote/play.json', {
        uri: uri
      }, cb);
    }
  }, {
    key: 'pause',
    value: function pause() {
      var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

      this.get('/remote/pause.json', {
        pause: true
      }, cb);
    }
  }, {
    key: 'resume',
    value: function resume() {
      var cb = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];

      this.get('/remote/pause.json', {
        pause: false
      }, cb);
    }
  }, {
    key: 'stat',
    value: function stat(cb) {
      this.get('/remote/status.json', {
        returnon: 'login,logout,play,pause,error,ap',
        returnafter: 60
      }, cb, { timeout: 70 * 1000 });
    }
  }, {
    key: 'change',
    value: function change(returnon, returnafter, cb) {
      this.get('/remote/status.json', {
        returnon: returnon,
        returnafter: returnafter
      }, cb, { timeout: (returnafter + 10) * 1000 });
    }
  }]);

  return Spotify;
}();

module.exports = function () {
  return new Spotify();
};

