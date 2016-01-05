var App, Controller, LAYER_BACKGROUND, LAYER_FOREGROUND, layer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

layer = 1;

LAYER_BACKGROUND = layer++;

LAYER_FOREGROUND = layer++;

App = {
  init: function() {
    var settings;
    settings = {
      viewport: {
        width: 100,
        height: 100
      }
    };
    if (Engine.init(settings)) {
      this.controller = new Controller();
    }
  }
};

Controller = (function(superClass) {
  extend(Controller, superClass);

  function Controller() {
    Controller.__super__.constructor.call(this);
    this.color = new Color('#fff');
    this.a = new Point(24, 24);
    this.b = new Point(74, 74);
    this.line = new Line(LAYER_FOREGROUND);
    this.line.setColor(this.color);
    this.line.from(this.a).to(this.b);
    this.timer = null;
    this.count = 0;
  }

  Controller.prototype.pickRandomColor = function() {
    var color, i, j, values;
    values = [0, 3, 6, 9, 'c', 'f'];
    color = '#';
    for (i = j = 1; j <= 3; i = ++j) {
      color += getRandomFromArray(values);
    }
    this.color.change(color);
  };

  Controller.prototype.pickRandomA = function() {
    var x, y;
    x = getRandomInt(0, 99);
    y = getRandomInt(0, 99);
    this.a.moveTo(x, y, 2000);
  };

  Controller.prototype.pickRandomB = function() {
    var x, y;
    x = getRandomInt(0, 99);
    y = getRandomInt(0, 99);
    this.b.moveTo(x, y, 2000);
  };

  Controller.prototype._update = function() {
    if (!this.timer) {
      this.timer = new Timer(1000);
    } else {
      if (this.timer.isComplete) {
        this.pickRandomColor();
        if (this.count % 2) {
          this.pickRandomA();
        } else {
          this.pickRandomB();
        }
        this.timer = null;
        this.count++;
      }
    }
  };

  return Controller;

})(Entity);
