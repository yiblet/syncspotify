var port = 24223;
var express = require('express');
var app = express();
var http = require('http').Server(app);
// var io = require('socket.io')(http);

var listening = [];
var current = {
  mode : '',
  uri : ''
}

var emit = () => {
  var old = listening;
  listening = [];
  while (old.length != 0) {
    old.pop()();
  }
}

app.get('/play/:uri', (req, res) => {
  current.mode = 'play';
  current.uri = req.params.uri;
  emit();
  console.log(`play ${req.params.uri}`)
  res.sendStatus(200);
})

app.get('/pause', (req, res) => {
  current.mode = 'pause';
  emit();
  console.log('pause')
  res.sendStatus(200);
})

app.get('/resume', (req, res) => {
  current.mode = 'resume';
  emit();
  console.log('resume')
  res.sendStatus(200);
})

app.get('/listen', (req, res) => {
  listening.push(() => {
    res.json(current);
  })
})

http.listen(port, () => {
  console.log('listening on' + `${port}`);
})
