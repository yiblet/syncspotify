var request = require('request');
class Spotify {
  constructor(){
    this.port = 4371;
    this.oauth_token = null;
    this.csrf_token = null;
  }

  getAuth(url, params, callback){
    var _self = this;
    this.csrf_token = null;
    request('http://open.spotify.com/token', (err, resp, body) => {
      if (err) throw err;
      _self.oauth_token = JSON.parse(body).t;
      _self.get('/simplecsrf/token.json', null, (body) => {
        _self.csrf_token = body.token;
        this.get(url, params, callback);
      })
    })
  }

  generateRandomString(){
    var charset = 'abcdefghijklmnopqrstuvwxyz';
    var arr = [];
    for (var i = 0; i < 10; i++) {
      arr.push(charset.charAt(Math.floor(Math.random() * charset.length)));
    }
    return arr.join('');
  }

  get(url, params = null, callback = () => {}, opts = null){
    if (! this.oauth_token) {
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
      rejectUnauthorized: false,// #YOLO
      url: 'https://' + this.generateRandomString() + '.spotilocal.com:' + this.port + url //getting around the domain connection limit
    }

    if (this.csrf_token) options.qs.csrf =  this.csrf_token;

    if (params) {
      for (let param in params) {
        options.qs[param] = params[param];
      }
    }

    if (opts) {
      for (let param in opts) {
        options[param] = opts[param];
      }
    }


    request(options, (err, resp, body) => {
      if (err) throw err;
      callback(JSON.parse(body));
    })
  }

  play(uri, cb = () => {}){
    this.get('/remote/play.json', {
      uri: uri
    }, cb)
  }

  pause(cb = () => {}){
    this.get('/remote/pause.json', {
      pause : true
    }, cb)
  }

  resume(cb = () => {}){
    this.get('/remote/pause.json', {
      pause : false
    }, cb)
  }

  stat(cb){
    this.get('/remote/status.json', {
      returnon : 'login,logout,play,pause,error,ap',
      returnafter : 60
    }, cb, {timeout : 70 * 1000})
  }

  change(returnon, returnafter, cb){
    this.get('/remote/status.json', {
      returnon : returnon,
      returnafter : returnafter
    }, cb, {timeout : (returnafter + 10) * 1000})
  }
}

module.exports = () => {
  return new Spotify();
}
