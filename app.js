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
    next: '/move'
  });
});

app.get('/move', function (req, res) {
  res.render('artbot', {
    title: 'Artie the ArtBot',
    next: '/draw'
  });
});

server.listen(3000);
