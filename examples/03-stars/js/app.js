var App, Star,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

App = {
  init: function() {
    var i, settings, star, x, y;
    settings = {
      viewport: {
        height: 120
      }
    };
    if (Engine.init(settings)) {
      for (y = i = 0; i <= 119; y = ++i) {
        star = new Star();
        x = getRandomInt(0, WINDOW.getWidth() - 1);
        star.setPosition(x, y);
        star.randomize();
      }
    }
  }
};

Star = (function(superClass) {
  extend(Star, superClass);

  function Star() {
    return Star.__super__.constructor.apply(this, arguments);
  }

  Star.prototype.update = function() {
    var x;
    x = this.getX();
    if (x < 0) {
      this.randomize();
      x = WINDOW.getWidth();
    } else {
      x = x - this.speed;
    }
    this.setPosition(x, this.getY());
    return Star.__super__.update.call(this);
  };

  Star.prototype.randomize = function() {
    this.speed = Math.random();
    this.setOpacity(this.speed);
  };

  return Star;

})(Particle);
