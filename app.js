var express = require('express'),
    http = require('http'),
    path = require('path');

var app = express(),
    server = http.createServer(app),
    io = require('socket.io')(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname);
  app.set('view engine', 'jade');
  // app.use(express.favicon());
  // app.use(express.logger('dev'));
  app.use(express.bodyParser());
  // app.use(express.methodOverride());
  app.use(app.router);
  // app.use(require('stylus').middleware(__dirname));
  app.use(express.static(path.join(__dirname)));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  res.render('artbot');
});

server.listen(3000);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});