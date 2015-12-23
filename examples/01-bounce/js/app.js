var App, BouncingParticle,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

App = {
  init: function() {
    var blue, green, i, j, red, settings;
    settings = {
      viewport: {
        width: 120,
        height: 90
      }
    };
    if (Engine.init(settings)) {
      this.leftPane = new Pane();
      this.leftPane.setCSS({
        left: 0,
        top: 0,
        bottom: 0,
        width: 40
      });
      this.centerPane = new Pane();
      this.centerPane.setCSS({
        left: 40,
        top: 0,
        bottom: 0,
        width: 40
      });
      this.rightPane = new Pane();
      this.rightPane.setCSS({
        right: 0,
        top: 0,
        bottom: 0,
        width: 40
      });
      for (i = j = 1; j <= 40; i = ++j) {
        red = new BouncingParticle();
        this.leftPane.addChild(red);
        red.setColor("#e10");
        red.setRandomPosition();
        red.setRandomMomentum();
        green = new BouncingParticle();
        this.centerPane.addChild(green);
        green.setColor("#5d0");
        green.setRandomPosition();
        green.setRandomMomentum();
        blue = new BouncingParticle();
        this.rightPane.addChild(blue);
        blue.setColor("#05d");
        blue.setRandomPosition();
        blue.setRandomMomentum();
      }
    }
  }
};

BouncingParticle = (function(superClass) {
  extend(BouncingParticle, superClass);

  function BouncingParticle() {
    return BouncingParticle.__super__.constructor.apply(this, arguments);
  }

  BouncingParticle.prototype.momentum = {
    horizontal: 0,
    vertical: 0
  };

  BouncingParticle.prototype.setRandomPosition = function() {
    var x, y;
    x = getRandomInt(0, this.reference.getWidth() - 1);
    y = getRandomInt(0, this.reference.getHeight() - 1);
    return this.setPosition(x, y);
  };

  BouncingParticle.prototype.setRandomMomentum = function() {
    var horizontal, vertical;
    horizontal = Math.random() - 0.5;
    vertical = Math.random() - 0.5;
    return this.addMomentum(horizontal, vertical);
  };

  BouncingParticle.prototype.addMomentum = function(horizontal, vertical) {
    this.momentum = {
      horizontal: horizontal,
      vertical: vertical
    };
  };

  BouncingParticle.prototype.update = function() {
    var newX, newY, x, y;
    newX = this.position.relative.x + this.momentum.horizontal;
    newY = this.position.relative.y + this.momentum.vertical;
    if (this.isWithinHorizontalBounds(newX)) {
      x = newX;
    } else {
      x = this.position.relative.x;
      this.momentum.horizontal = 0 - this.momentum.horizontal;
    }
    if (this.isWithinVerticalBounds(newY)) {
      y = newY;
    } else {
      y = this.position.relative.y;
      this.momentum.vertical = 0 - this.momentum.vertical;
    }
    this.setPosition(x, y);
    return BouncingParticle.__super__.update.call(this);
  };

  return BouncingParticle;

})(Particle);
