var vektor = require('vektor'),
    v = require('vektor').vector,
    r = require('vektor').rotate,
    h = require('vektor').homog;

var random = new Random();

var CANVAS_HEIGHT = 300,
    CANVAS_WIDTH = 500;

// var socket = io.connect('http://localhost');

var move = document.getElementById("move"),
    draw = document.getElementById("draw"),
    mv = move.getContext("2d"),
    dw = draw.getContext("2d"),
    curr = { x: 250, y: 150, z: 0},
    theta = 0,
    isDrawing = false;

drawBot(curr);

function drawBot (pt) {
  mv.setStrokeColor('black');
  dw.beginPath();
  mv.beginPath();
  dw.arc(pt.x, pt.y, 10, 0, Math.PI*2, 0);
  mv.arc(pt.x, pt.y, 10, 0, Math.PI*2, 0);
  if (isDrawing) dw.fill();
  mv.stroke();

  drawBatbot();
  curr = pt;
}

function moveBot (d, theta) {
  mv.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  translatePoint(d, -theta);
}

function translatePoint (d, alpha) {
//console.log(curr, d, alpha)
  theta += alpha;
  // console.log(theta * 180 / Math.PI)
  var T = h(r.RotX(0), new v(0, 0, 0)),
      T1 = T.dot(h(r.RotZ(theta), new v(curr))),
      T2 = T1.dot(h(0, new v(0, d || 0, 0)));

  var EE = T2.getPoint();

  drawBot(EE);
}

function clear () {
  dw.clearRect(0, 0, 500, 300);
  moveBot(0, 0);
  // socket.emit('move', { direction: 'stop' });
}

window.onkeypress = function (e) {
  switch (e.keyCode) {
    case 119: fwd(); break; // w
    case 97: left(); break; // a
    case 115: bkwd(); break; // s
    case 100: right(); break; // d
    case 32: toggleDraw(); break; // space
    case 107: clear(); break; // k
    case 103: go(); break; // g
  }
}

function fwd (steps) {
  console.log('forward!')
  moveBot(steps || 10, 0);
  // socket.emit('move', { direction: 'fwd' });
}

function bkwd (steps) {
  console.log('backward!')
  moveBot(-steps || -10, 0);
  // socket.emit('move', { direction: 'bkwd' });
}

function left () {
  console.log('left!')
  moveBot(0, Math.PI/2);
  // socket.emit('move', { direction: 'left' });
}

function right () {
  console.log('right!')
  moveBot(0, -Math.PI/2);
  // socket.emit('move', { direction: 'right' });
}

function go () {
  console.log('go!')

  // close in the workspace
  var WKSP_BORDER = 50;
  var X_MIN = WKSP_BORDER,
      X_MAX = CANVAS_WIDTH - WKSP_BORDER,
      Y_MIN = WKSP_BORDER,
      Y_MAX = CANVAS_HEIGHT - WKSP_BORDER;

  // pick a drawing option
  if (random.bool()) toggleDraw();

  // pick a random direction 
  var direction = random.pick([fwd, fwd, left, right, bkwd, bkwd]);
  direction(20);

}

function toggleDraw () {
  isDrawing = !isDrawing;
  console.log('draw: ', isDrawing);
  moveBot(0, 0);
  // socket.emit('draw', isDrawing);
}

function drawBatbot () {
  var portrait = theta / 90 % 2
  var width = 82;
  var height = 50;
  var x = curr.x + width / 2;
  var y = curr.y + height / 2;
  var bb = document.getElementById('bb');

  mv.translate(x, y);
  mv.rotate(theta - Math.PI);
  mv.drawImage(bb, 0, 0);
  // mv.drawImage(bb, -width / 2, -height / 2, width, height);
  mv.rotate(-theta + Math.PI);
  mv.translate(-x, -y);
}
