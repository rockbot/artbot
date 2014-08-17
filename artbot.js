var five = require('johnny-five');

var board, lServo, rServo,
    moveSpeed = 0.1;

var moves = {
  fwd: function (timeout) {
    // console.log("fwd")
    return turn(true, true, timeout);
  },
  bkwd: function (timeout) {
    // console.log("bkwd")
    return turn(false, false, timeout);
  },
  left: function (timeout) {
    // console.log("left")
    return turn(true, false, timeout);
  },
  right: function (timeout) {
    // console.log("right")
    return turn(false, true, timeout);
  },
  stop: function () {
    // console.log("stop")
    lServo.stop();
    rServo.stop();
  }
}

function turn (leftOn, rightOn, timeout) {
  if (leftOn) {
    lServo.ccw(moveSpeed);
  } else {
    lServo.cw(moveSpeed);
  }

  if (rightOn) {
    rServo.cw(moveSpeed);
  } else {
    rServo.ccw(moveSpeed);
  }

  if (timeout) {
    setTimeout(moves.stop, timeout)
  }
}

module.exports = function ArtBot (io) {
  board = new five.Board();

  board.on('ready', function () {

    var led = new five.Led(13);
    led.strobe(2000);

    lServo = new five.Servo({
      pin: 11,
      type: 'continuous'
    });

    rServo = new five.Servo({
      pin: 10,
      type: 'continuous'
    });

    marker = new five.Servo({
      pin: 9
    });

    moves.stop();
    marker.center();

    this.repl.inject({
      marker: marker,
      led: led
    });

    io.on('connection', function (socket) {
      socket.on('move', function (data) {
        // console.log(data.direction)
        moves[data.direction](700);
      });

      socket.on('draw', function (drawOn) {
        // console.log('draw? ', drawOn);
        if (drawOn) {
          marker.min();
        } else {
          marker.to(30);
        }
      })
    });
  })
}
