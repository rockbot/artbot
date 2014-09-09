var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express(),
    server = http.createServer(app),
    io = require('socket.io')(server);

// var Artbot = require('./artbot')(io);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, '/layouts'));
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname)));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.render('artbot', {
    title: 'Canvas Drawing',
    script: 'canvas',
    next: '/move'
  });
});

app.get('/move', function (req, res) {
  res.render('artbot', {
    title: 'Artie the ArtBot',
    script: 'move',
    next: '/draw'
  });
});

app.get('/draw', function (req, res) {
  res.render('artbot', {
    title: 'Mega Demo!!',
    script: 'draw',
    prev: '/move'
  });
});

server.listen(3000);
