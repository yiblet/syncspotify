'use strict';

var port = 24223;
var express = require('express');
var app = express();
var http = require('http').Server(app);
// var io = require('socket.io')(http);

var listening = [];
var current = {
  mode: '',
  uri: ''
};

var emit = function emit() {
  var old = listening;
  listening = [];
  while (old.length != 0) {
    old.pop()();
  }
};

app.get('/play/:uri', function (req, res) {
  current.mode = 'play';
  current.uri = req.params.uri;
  emit();
  console.log('play ' + req.params.uri);
  res.sendStatus(200);
});

app.get('/pause', function (req, res) {
  current.mode = 'pause';
  emit();
  console.log('pause');
  res.sendStatus(200);
});

app.get('/resume', function (req, res) {
  current.mode = 'resume';
  emit();
  console.log('resume');
  res.sendStatus(200);
});

app.get('/listen', function (req, res) {
  listening.push(function () {
    res.json(current);
  });
});

http.listen(port, function () {
  console.log('listening on' + ('' + port));
});

