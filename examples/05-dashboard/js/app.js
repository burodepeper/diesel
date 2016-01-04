var App, LAYER_RADAR_DECORATION, LAYER_RADAR_UI, LAYER_STARS, Radar, RadarSweeper, Star, StarLabel, Stars, layer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

layer = 1;

LAYER_STARS = layer++;

LAYER_RADAR_DECORATION = layer++;

LAYER_RADAR_UI = layer++;

App = {
  init: function() {
    var css, diameter, settings;
    settings = {
      viewport: {
        width: 320,
        height: 180
      }
    };
    if (Engine.init(settings)) {
      this.radar = new Radar();
      diameter = this.radar.diameter;
      css = {
        width: diameter,
        height: diameter,
        left: 'center',
        top: 'center'
      };
      this.radar.setCSS(css);
      this.stars = new Stars();
      this.stars.setCSS(css);
      this.stars.init(this.radar);
    }
  }
};

Radar = (function(superClass) {
  extend(Radar, superClass);

  Radar.prototype.colors = {
    white: new Color('#fff'),
    red: new Color('#e10'),
    grey: new Color('rgba(255, 255, 255, 0.15)')
  };

  Radar.prototype.diameter = 160;

  Radar.prototype.range = 1000;

  function Radar() {
    Radar.__super__.constructor.call(this);
    this.createVisuals();
    this.createSweeper();
  }

  Radar.prototype.createSweeper = function() {
    this.sweeper = new RadarSweeper();
    this.addChild(this.sweeper);
    this.sweeper.setAnchor(this.frame.getCenter());
    return this.sweeper.setLength(this.diameter / 2);
  };

  Radar.prototype.createVisuals = function() {
    var angle, center, circle, circleSize, circleSizes, i, increment, j, k, large, len, length, line, medium, numberOfSpokes, offset, position, ref, results, size, small;
    this.frame = new Circle(LAYER_RADAR_DECORATION);
    this.addChild(this.frame);
    this.frame.setSize(this.diameter);
    this.frame.outline(this.colors.white);
    large = 0.9;
    medium = 0.5;
    small = 0.25;
    circleSizes = [large, medium, small];
    for (j = 0, len = circleSizes.length; j < len; j++) {
      circleSize = circleSizes[j];
      circle = new Circle(LAYER_RADAR_DECORATION);
      this.addChild(circle);
      size = this.diameter * circleSize;
      position = (this.diameter - size) / 2;
      circle.setSize(size);
      circle.outline(this.colors.grey);
      circle.setPosition(position, position);
    }
    center = this.frame.getCenter();
    numberOfSpokes = 24;
    increment = 360 / numberOfSpokes;
    length = (this.diameter / 2) * large;
    angle = 0;
    results = [];
    for (i = k = 0, ref = numberOfSpokes - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      offset = i % 3 !== 0 ? medium / large : small;
      line = new Line(LAYER_RADAR_DECORATION);
      this.addChild(line);
      line.from(center).atAngle(angle, length, offset);
      line.setColor(this.colors.grey);
      results.push(angle += increment);
    }
    return results;
  };

  return Radar;

})(Pane);

RadarSweeper = (function(superClass) {
  extend(RadarSweeper, superClass);

  function RadarSweeper() {
    RadarSweeper.__super__.constructor.call(this);
    this.angle = getRandomInt(0, 359);
    this.angleIncrement = 360 / 4 / 60;
    this.line = new Line(LAYER_RADAR_UI);
    this.addChild(this.line);
    this.line.setColor(new Color('#fff'));
  }

  RadarSweeper.prototype.setAnchor = function(anchor) {
    this.anchor = anchor;
    return this.line.from(this.anchor);
  };

  RadarSweeper.prototype.setLength = function(length1) {
    this.length = length1;
  };

  RadarSweeper.prototype.update = function() {
    this.line.atAngle(this.angle, this.length);
    this.angle += this.angleIncrement;
    return this.angle %= 360;
  };

  return RadarSweeper;

})(Pane);

Star = (function(superClass) {
  extend(Star, superClass);

  function Star(_layer) {
    this._layer = _layer;
    Star.__super__.constructor.call(this, this._layer);
    this.x = null;
    this.y = null;
    this.z = null;
  }

  Star.prototype.init = function(z, range) {
    this.z = z;
    this.range = range;
    this.angle = getRandomInt(0, 359);
    this.radians = this.angle * (Math.PI / 180);
    this.passingDistance = getRandomInt(1, this.range);
    this.x = Math.sin(this.radians) * this.passingDistance;
    this.y = Math.cos(this.radians) * this.passingDistance;
    this.particle = new Particle(LAYER_STARS);
    this.addParticle(this.particle);
    this.particle.setColor(new Color('#fff'));
    if (this.passingDistance < (this.range * 0.1)) {
      return this.addLabel();
    }
  };

  Star.prototype.addLabel = function() {
    return this.label = new StarLabel(this);
  };

  Star.prototype.update = function() {
    var distance, length, opacity, s, x, y;
    s = Math.sqrt((this.x * this.x) + (this.z * this.z));
    distance = Math.sqrt((s * s) + (this.y * this.y));
    opacity = (this.range - distance) / this.range;
    length = ((this.range - distance + this.passingDistance) / this.range) * 80;
    x = 80 + Math.sin(this.radians) * length;
    y = 80 + Math.cos(this.radians) * length;
    this.setPosition(x, y);
    this.particle.setOpacity(opacity);
    this.z -= 1;
    if (this.z <= 0) {
      this.remove();
      App.stars.createStar();
    }
    return Star.__super__.update.call(this);
  };

  Star.prototype.remove = function() {
    if (this.label) {
      this.label.remove();
    }
    this.particle.remove();
    return Star.__super__.remove.call(this);
  };

  return Star;

})(Pane);

StarLabel = (function(superClass) {
  extend(StarLabel, superClass);

  function StarLabel(star1) {
    var font;
    this.star = star1;
    StarLabel.__super__.constructor.call(this);
    this.circle = new Circle(LAYER_RADAR_UI);
    this.addChild(this.circle);
    this.circle.setSize(5);
    this.circle.setPosition(-2, -2);
    this.circle.outline('rgba(255, 0, 0, 0.5)');
    font = new Font('9PX');
    this.label = new Text(LAYER_RADAR_UI);
    this.addChild(this.label);
    this.label.setFont(font);
    this.label.setPosition(4, -4);
    this.label.setText(this.star.z);
  }

  StarLabel.prototype.update = function() {
    this.setPosition(this.star.getX(), this.star.getY());
    this.circle.hasChanged = true;
    this.label.hasChanged = true;
    return StarLabel.__super__.update.call(this);
  };

  StarLabel.prototype.remove = function() {
    this.circle.remove();
    this.label.remove();
    return StarLabel.__super__.remove.call(this);
  };

  return StarLabel;

})(Pane);

Stars = (function(superClass) {
  extend(Stars, superClass);

  function Stars() {
    Stars.__super__.constructor.call(this);
  }

  Stars.prototype.init = function(radar) {
    var i, j, results;
    this.radar = radar;
    this.range = this.radar.range;
    results = [];
    for (i = j = 0; j <= 10; i = ++j) {
      results.push(this.createStar(getRandomInt(1, this.range)));
    }
    return results;
  };

  Stars.prototype.createStar = function(distance) {
    var star;
    if (distance == null) {
      distance = this.range;
    }
    star = new Star();
    this.addChild(star);
    return star.init(distance, this.range);
  };

  return Stars;

})(Pane);
