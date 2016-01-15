var App, LAYER_BACKGROUND, LAYER_STARS, LAYER_UI, Spaceship, Star, Stars, layer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

layer = 1;

LAYER_BACKGROUND = layer++;

LAYER_STARS = layer++;

LAYER_UI = layer++;

App = {
  init: function() {
    var settings;
    settings = {
      viewport: {
        width: 320,
        height: 180
      }
    };
    if (Engine.init(settings)) {
      this.spaceship = new Spaceship();
      this.stars = new Stars();
      this.stars.setCSS({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      });
      this.spaceship.accelerateTo(25);
    }
  }
};

Spaceship = (function(superClass) {
  extend(Spaceship, superClass);

  function Spaceship() {
    Spaceship.__super__.constructor.call(this);
    this._speed = 0;
    this._accelerationTween = null;
  }

  Spaceship.prototype.getSpeed = function() {
    return this._speed;
  };

  Spaceship.prototype.setSpeed = function(_speed) {
    this._speed = _speed;
  };

  Spaceship.prototype.accelerateTo = function(speed) {
    var parameters;
    parameters = [];
    parameters.push({
      name: 'speed',
      from: this._speed,
      to: speed
    });
    this._accelerationTween = new Tween(parameters, 5000, 'linear');
  };

  Spaceship.prototype._update = function() {
    if (this._accelerationTween != null) {
      this.setSpeed(this._accelerationTween.getValue('speed'));
      if (this._accelerationTween.isComplete) {
        return this._accelerationTween = null;
      }
    }
  };

  return Spaceship;

})(Controller);

Star = (function(superClass) {
  extend(Star, superClass);

  Star.prototype._viewportDistance = 10;

  Star.prototype._maxDistance = 10000;

  function Star(_layer) {
    this._layer = _layer;
    Star.__super__.constructor.call(this, this._layer);
    this._offsetX = this._reference.getWidth() / 2;
    this._offsetY = this._reference.getHeight() / 2;
    this._xMultiplier = (this._offsetX / this._viewportDistance) * Math.sqrt(2);
    this._yMultiplier = (this._offsetX / this._viewportDistance) * Math.sqrt(2);
  }

  Star.prototype.setCoordinates = function(x1, y1, z1) {
    this.x = x1;
    this.y = y1;
    this.z = z1;
    this.passingDistance = Math.sqrt(this.x * this.x + this.y * this.y);
    this.maxOpacity = 1 - (this.passingDistance / (this._offsetX * this._offsetY));
    this._calculatePosition();
    return this._calculateOpacity();
  };

  Star.prototype._update = function() {
    if ((this.z < Math.abs(this.x)) || (this.z < Math.abs(this.y))) {
      this.remove();
      return App.stars.addStar();
    } else {
      this._calculatePosition();
      this._calculateOpacity();
      return this.z -= App.spaceship.getSpeed();
    }
  };

  Star.prototype._calculatePosition = function() {
    var x, xDistance, y, yDistance;
    xDistance = Math.sqrt(this.z * this.z + this.x * this.x);
    x = this.x * (this._viewportDistance / xDistance) * this._xMultiplier;
    yDistance = Math.sqrt(this.z * this.z + this.y * this.y);
    y = this.y * (this._viewportDistance / yDistance) * this._yMultiplier;
    this.setPosition(this._offsetX + x, this._offsetY + y);
    this._distance = (xDistance + yDistance) / 2;
  };

  Star.prototype._calculateOpacity = function() {
    var opacity;
    opacity = 1 - (this._distance / this._maxDistance);
    opacity = opacity < 0.1 ? 0 : Math.pow(opacity, 5);
    if (opacity > this.maxOpacity) {
      opacity = this.maxOpacity;
    }
    this.setOpacity(opacity);
  };

  return Star;

})(Particle);

Stars = (function(superClass) {
  extend(Stars, superClass);

  function Stars() {
    var i, j, numberOfStars, ref, z;
    Stars.__super__.constructor.call(this);
    this.width = WINDOW.getWidth();
    this.height = WINDOW.getHeight();
    this.center = WINDOW.getCenter();
    numberOfStars = this.width * this.height / 10 / 4;
    for (i = j = 1, ref = numberOfStars; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      z = getRandomInt(100, 10000);
      this.addStar(z);
    }
  }

  Stars.prototype.addStar = function(z) {
    var star, x, y;
    if (z == null) {
      z = 10000;
    }
    x = getRandomInt(0, this.width * 10) - (this.width * 5);
    y = getRandomInt(0, this.height * 10) - (this.height * 5);
    star = new Star(LAYER_STARS);
    return star.setCoordinates(x, y, z);
  };

  return Stars;

})(Pane);
