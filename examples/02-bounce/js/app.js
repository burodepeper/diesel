var App, BouncingParticle, PaneController,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

App = {
  init: function() {
    var settings;
    settings = {
      viewport: {
        width: 160,
        height: 90
      }
    };
    if (Engine.init(settings)) {
      this.red = new PaneController();
      this.red.setSize(20);
      this.red.setY(0);
      this.red.setColor('#e10');
      this.red.init();
      this.green = new PaneController();
      this.green.setSize(30);
      this.green.setY(20);
      this.green.setColor('#5d0');
      this.green.init();
      this.blue = new PaneController();
      this.blue.setSize(40);
      this.blue.setY(50);
      this.blue.setColor('#05d');
      this.blue.init();
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

PaneController = (function(superClass) {
  extend(PaneController, superClass);

  function PaneController() {
    return PaneController.__super__.constructor.apply(this, arguments);
  }

  PaneController.prototype.size = null;

  PaneController.prototype.y = null;

  PaneController.prototype.speed = null;

  PaneController.prototype.color = null;

  PaneController.prototype.init = function() {
    var i, j, particle, ref;
    if ((this.size != null) && (this.y != null) && (this.color != null)) {
      this.pane = new Pane();
      this.pane.setSize(this.size, this.size);
      this.pane.setPosition(0, this.y);
      for (i = j = 1, ref = this.size; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        particle = new BouncingParticle();
        this.pane.addChild(particle);
        particle.setColor(this.color);
        particle.setRandomPosition();
        particle.setRandomMomentum();
      }
      return this.setState('left-to-right');
    }
  };

  PaneController.prototype.update = function() {
    var parameters, right, x, y;
    switch (this.state) {
      case 'tween':
        x = this.tween.getValue('x');
        y = this.pane.position.relative.y;
        this.pane.setPosition(x, y);
        if (this.tween.isComplete) {
          return this.setState(this.nextState);
        }
        break;
      case 'left-to-right':
        right = this.pane.reference.getWidth() - this.pane.getWidth();
        parameters = [];
        parameters.push({
          name: 'x',
          from: 0,
          to: right
        });
        this.tween = new Tween(parameters, 3000, 'ease-in-out');
        return this.setState('tween', 'right-to-left');
      case 'right-to-left':
        right = this.pane.reference.getWidth() - this.pane.getWidth();
        parameters = [];
        parameters.push({
          name: 'x',
          from: right,
          to: 0
        });
        this.tween = new Tween(parameters, 3000, 'ease-in-out');
        return this.setState('tween', 'left-to-right');
    }
  };

  PaneController.prototype.setSize = function(size) {
    this.size = size;
  };

  PaneController.prototype.setY = function(y1) {
    this.y = y1;
  };

  PaneController.prototype.setSpeed = function(speed) {
    this.speed = speed;
  };

  PaneController.prototype.setColor = function(color) {
    this.color = color;
  };

  return PaneController;

})(Controller);
