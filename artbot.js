var vektor = require('vektor'),
    v = require('vektor').vector,
    r = require('vektor').rotate,
    h = require('vektor').homog;

var socket = io.connect('http://localhost');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});

var move = document.getElementById("move"),
    draw = document.getElementById("draw"),
    mv = move.getContext("2d"),
    dw = draw.getContext("2d"),
    curr = { x: 10, y: 10, z: 0},
    theta = 0,
    isDrawing = false;

drawBot(curr);

function drawBot (pt) {
  dw.beginPath();
  mv.beginPath();
  dw.arc(pt.x, pt.y, 10, 0, Math.PI*2, 0);
  mv.arc(pt.x, pt.y, 10, 0, Math.PI*2, 0);
  if (isDrawing) dw.fill();
  mv.stroke();
  curr = pt;
}

function moveBot (d, theta) {
  mv.clearRect(0, 0, 500, 300);
  translatePoint(d, theta);
}

function translatePoint (d, alpha) {
console.log(curr, d, alpha)
  theta += alpha;
  console.log(theta)
  var T = h(r.RotX(0), new v(0, 0, 0)),
      T1 = T.dot(h(r.RotZ(theta), new v(curr))),
      T2 = T1.dot(h(0, new v(0, d || 0, 0)));

  var EE = T2.getPoint();
  console.log(EE)

  drawBot(EE);
}

function clear () {
  dw.clearRect(0, 0, 500, 300);
  moveBot(0, 0);
}

window.onkeypress = function (e) {
  switch (e.keyCode) {
    case 119: fwd(); break; // w
    case 97: left(); break; // a
    case 115: bkwd(); break; // s
    case 100: right(); break; // d
    case 32: toggleDraw(); break;
    case 107: clear(); break;
  }

  // console.log(e.keyCode)
}

function fwd () {
  console.log('forward!')
  moveBot(10, 0);
}

function bkwd () {
  console.log('backward!')
  moveBot(-10, 0);
}

function left () {
  console.log('left!')
  moveBot(0, Math.PI/2);
}

function right () {
  console.log('right!')
  moveBot(0, -Math.PI/2);
}

function toggleDraw () {
  isDrawing = !isDrawing;
  moveBot(0, 0);
}

function getMousePosition (ev) {
  var offset = $('canvas').offset();
  var pt = {
    x : ev.clientX - offset.left,
    y : ev.clientY - offset.top
  };
  return pt;
}

// var pts;
 
// window.onmousedown = function (ev) {
//   moveBot(getMousePosition(ev));
//   isDrawing = true;
//   pts = [];
// };

// window.onmousemove = function (e) {
//   if (isDrawing) {
//     var pt = getMousePosition(e);
//     moveBot(pt);
//     pts.push(pt);
//   }
// }

// window.onmouseup = function (e) {
//   isDrawing = false;
//   console.log(pts);
// }

