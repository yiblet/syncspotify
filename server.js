var port = 24223;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', () => {
  console.log('new connection');
})

app.get('/play/:uri', (req, res) => {
  io.emit(req.params.uri);
  console.log(`play ${req.params.uri}`)
  res.sendStatus(200);
})

app.get('/pause', (req, res) => {
  io.emit('pause');
  console.log('pause')
  res.sendStatus(200);
})

app.get('/resume', (req, res) => {
  io.emit('resume');
  console.log('resume')
  res.sendStatus(200);
})

http.listen(port, function(){
  console.log('listening on ' + `${port}`);
});
