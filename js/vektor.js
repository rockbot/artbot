require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"284Cz+":[function(require,module,exports){
module.exports = require('./lib/vektor');
},{"./lib/vektor":7}],"vektor":[function(require,module,exports){
module.exports=require('284Cz+');
},{}],3:[function(require,module,exports){
var v = require('./vector'),
    m = require('./matrix'),
    Rotate = require('./rotate');

var Homog = function Homog (rot, trans) {
  if (rot === 0) {
    rot = new Rotate.RotX(0);
  }

  if (trans === 0) {
    trans = new v([0, 0, 0]);
  }

  if (rot.cols !== rot.rows || trans.v.length !== rot.cols) {
    return new Error('Rotation matrix must be square and transform must be of same order as matrix');
  }

  var H = new m(4);

  // fill in the rotation part
  for (var r = 0; r < rot.rows; ++r) {
    for (var c = 0; c < rot.cols; ++c) {
      H.set(r, c, rot.get(r, c));
    }
  }

  // fill in the translation part
  for (var t = 0; t < trans.v.length; ++t) {
    H.set(t, 3, trans.v[t]);
  }


  // add the buffer zone
  if (rot.cols === 2) { // for 2D systems
    H.set(2, 0, 0);
    H.set(2, 1, 0);
    H.set(2, 2, 1);
    H.set(2, 3, 0);
  }

  H.set(3, 0, 0);
  H.set(3, 1, 0);
  H.set(3, 2, 0);
  H.set(3, 3, 1);

  return H;
};

exports = module.exports = Homog;
},{"./matrix":4,"./rotate":5,"./vector":6}],4:[function(require,module,exports){
var v = require('./vector');

// -----------------------------------------------------------
// Matrices
// -----------------------------------------------------------
var Matrix = function Matrix (rows, cols, isIdentity) {
  // initialize the matrix
  this.rows = rows;
  this.cols = cols ? cols : rows; // make it a square matrix if only one argument

  this.m = new Array(rows);
  for (var r = 0; r < rows; ++r) {
    this.m[r] = new Array(cols);
    for (var c = 0; c < cols; ++c) {
      this.m[r][c] = 0;
    }
  }

  this.isVector = false;

  this.size = {rows: this.rows, cols: this.cols};

};

Matrix.prototype = {
  set : function (i, j, val) {
    this.m[i][j] = parseFloat(val.toFixed(6));
  },

  get : function (i, j) {
    return this.m[i][j];
  },

  scale: function (a) {
    var C = new Matrix(this.rows, this.cols);
    for (var r = 0; r < this.rows; ++r) {
      for (var c = 0; c < this.cols; ++c) {
        var val = this.get(r,c) * a;
        C.set(r,c, val);
      }
    }
    return C;
  },

  add: function (B) {
    if (B.cols !== this.cols || B.rows !== this.rows)
      return new Error('A and B must be the same size');

    var C = new Matrix(this.rows, this.cols);
    for (var r = 0; r < this.rows; ++r) {
      for (var c = 0; c < this.cols; ++c) {
        var val = this.get(r,c) + B.get(r,c);
        C.set(r,c, val);
      }
    }
    return C;
  },

  dot: function (B) {
    if (B.isVector ? B.v.length !== this.cols : B.rows !== this.cols) {
      return new Error('number of cols of A must equal number of rows of B');
    }

    var C;
    if (B.isVector) {
      var arr = Array(B.v.length);
      for (var i = 0; i < B.v.length; ++i) {
        arr[i] = 0;
        for (var j = 0; j < this.rows; ++j) {
          arr[i] += parseFloat((this.get(i,j) * B.v[j]).toFixed(6));
        }
      }
      C = new v(arr);
    } else {
      C = new Matrix(this.rows, B.cols);
      for (var r = 0; r < C.rows; ++r) {
        for (var c = 0; c < C.cols; ++c) {
          var val = 0;
          for (var m = 0; m < B.rows; ++m) {
             val += parseFloat((this.get(r,m) * B.get(m,c)).toFixed(6));
          }
          // console.log(val);
          C.set(r, c, val);
        }
      }

    }
    return C;
  },

  transpose: function() {
    var T = new Matrix(this.rows, this.cols);

    for (var r = 0; r < this.rows; ++r)
    {
      for (var c = 0; c < this.cols; ++c)
      {
        T.m[r][c] = this.m[c][r];
      }
    }
    return T;
  },

  det: function () {
    if (this.rows === 3 && this.cols ===3) {
      var chunk1 = this.m[0][0] * (this.m[1][1] * this.m[2][2] - this.m[1][2] * this.m[2][1]);
      var chunk2 = - this.m[0][1] * (this.m[1][0] * this.m[2][2] - this.m[1][2] * this.m[2][0]);
      var chunk3 = this.m[0][2] * (this.m[1][0] * this.m[2][1] - this.m[1][1] * this.m[2][0]);
      return chunk1 + chunk2 + chunk3;
    }

    if (this.rows === 2 && this.cols === 2) {
      return this.m[0][0] * this.m[1][1] - this.m[0][1] * this.m[1][0];
    }

    return new Error('your matrix is too big or not square or... something');
  },

  trace: function () {
    if (this.rows !== this.cols)
      return new Error('this is not a square matrix');

    var trace = 0;
    for (var r = 0; r < this.rows; ++r) {
      trace += this.m[r][r];
    }

    return trace;
  },

  getPoint: function () {
    if (this.rows === 4 && this.cols === 4)
      return new v(this.get(0, 3), this.get(1, 3), this.get(2,3));
    else
      return new Error('this is not a homogeneous matrix');
  },

  getRot: function () {
    if (this.rows === 4 && this.cols === 4)
      var C = new Matrix(3, 3);
      for (var r = 0; r < 3; ++r) {
        for (var c = 0; c < 3; ++c) {
          var val = this.get(r,c);
          C.set(r,c, val);
        }
      }
      return C;
  },

  calcRotAng: function () {
    return Math.acos((this.getRot().trace() - 1)/2);
  },

  calcRotVec: function () {
    var rotMat = this.getRot();
    var rotAng = this.calcRotAng();
    var negRT = rotMat.scale(-1).transpose();
    var skewR = rotMat.add(negRT).scale(1/(2 * Math.sin(rotAng)));

    return new v(-skewR.get(1,2), skewR.get(0,2), -skewR.get(0,1));
  }
};


exports = module.exports = Matrix;

},{"./vector":6}],5:[function(require,module,exports){
var m = require('./matrix');

// -----------------------------------------------------------
// rotation matrix around the X axis
// -----------------------------------------------------------
exports.RotX = function RotX(theta, isDeg) {
  if (isDeg) theta *= (2 * Math.PI / 360);

  var R = new m(3);

  R.set(0, 0, 1);
  R.set(0, 1, 0);
  R.set(0, 2, 0);

  R.set(1, 0, 0); 
  R.set(1, 1, Math.cos(theta));
  R.set(1, 2, -Math.sin(theta));

  R.set(2, 0, 0);
  R.set(2, 1, Math.sin(theta));
  R.set(2, 2, Math.cos(theta));

  return R;
};

// -----------------------------------------------------------
// rotation matrix around the Y axis
// -----------------------------------------------------------
exports.RotY = function RotY(theta, isDeg) {
  if (isDeg) theta *= (2 * Math.PI / 360);

  var R = new m(3);

  R.set(0, 0, Math.cos(theta));
  R.set(0, 1, 0);
  R.set(0, 2, Math.sin(theta));

  R.set(1, 0, 0);
  R.set(1, 1, 1);
  R.set(1, 2, 0);

  R.set(2, 0, -Math.sin(theta));
  R.set(2, 1, 0);
  R.set(2, 2, Math.cos(theta));

  return R;
};

// -----------------------------------------------------------
// rotation matrix around the Z axis
// -----------------------------------------------------------
exports.RotZ = function RotZ(theta, isDeg) {
  if (isDeg) theta *= (2 * Math.PI / 360);

  var R = new m(3);

  R.set(0, 0, Math.cos(theta));
  R.set(0, 1, -Math.sin(theta));
  R.set(0, 2, 0);

  R.set(1, 0, Math.sin(theta));
  R.set(1, 1, Math.cos(theta));
  R.set(1, 2, 0);

  R.set(2, 0, 0);
  R.set(2, 1, 0);
  R.set(2, 2, 1);

  return R;
};

module.exports = exports;

},{"./matrix":4}],6:[function(require,module,exports){
// -----------------------------------------------------------
// Vectors
// -----------------------------------------------------------
var Vector = function Vector (x, y, z) {
  if (typeof y === 'undefined' && typeof z === 'undefined') {
    this.x = typeof x.x !== 'undefined' ? x.x : x[0];
    this.y = typeof x.y !== 'undefined' ? x.y : x[1];
    this.z = typeof x.z !== 'undefined' ? x.z : x[2];
  } else {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  this.v = typeof this.z !== 'undefined' ? [this.x, this.y, this.z] : [this.x, this.y];

};

Vector.prototype = {
  add: function (b) {
    return new Vector(this.x + b.x, this.y + b.y, this.z + b.z);
  },

  dot: function (b) {
    return this.x * b.x + this.y * b.y + this.z * b.z;
  },

  isVector: true,

  moveTo: function(pt) {
    this.x = typeof pt.x !== 'undefined' ? pt.x : pt[0];
    this.y = typeof pt.y !== 'undefined' ? pt.y : pt[1];
    this.z = typeof pt.z !== 'undefined' ? pt.z : pt[2];
  },
  cross: function (b) {
    var i = this.y * b.z - this.z * b.y;
    var j = this.z * b.x - this.x * b.z;
    var k = this.x * b.y - this.y * b.x;
    return new Vector(i, j, k);
  },

  distanceFrom: function (b) {
    var sumOfSquares = 0;
    for (var i = 0; i < this.v.length; ++i) {
      sumOfSquares += (this.v[i] - b.v[i]) * (this.v[i] - b.v[i]);
    }

    return Math.sqrt(sumOfSquares);

  },

  length: function () {
    var sumOfSquares = 0;
    for (var i = 0; i < this.v.length; ++i) {
      sumOfSquares += this.v[i] * this.v[i];
    }
    return Math.sqrt(sumOfSquares)
  }
};

exports = module.exports = Vector;

},{}],7:[function(require,module,exports){
exports.vector = require('./vector');
exports.matrix = require('./matrix');
exports.rotate = require('./rotate');
exports.homog = require('./homog');
},{"./homog":3,"./matrix":4,"./rotate":5,"./vector":6}]},{},[])