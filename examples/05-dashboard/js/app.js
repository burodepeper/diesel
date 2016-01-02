var App, LAYER_RADAR_DECORATION, LAYER_RADAR_UI, LAYER_STARS, Radar, layer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

layer = 1;

LAYER_STARS = layer++;

LAYER_RADAR_DECORATION = layer++;

LAYER_RADAR_UI = layer++;

App = {
  init: function() {
    var settings;
    settings = {
      viewport: {
        width: 240,
        height: 240
      }
    };
    if (Engine.init(settings)) {
      this.radar = new Radar();
      this.radar.setSize(200, 200);
      this.radar.setPosition(20, 20);
    }
  }
};

Radar = (function(superClass) {
  extend(Radar, superClass);

  Radar.prototype.colors = {
    red: new Color('#e10'),
    grey: new Color('rgba(255, 255, 255, 0.15)')
  };

  function Radar() {
    var angle, center, circle, diameter, i, increment, j, large, length, line, medium, numberOfSpokes, offset, position, ref, size, small;
    Radar.__super__.constructor.call(this);
    diameter = 200;
    large = 0.9;
    medium = 0.5;
    small = 0.25;
    this.frame = new Circle(LAYER_RADAR_DECORATION);
    this.addChild(this.frame);
    this.frame.setSize(diameter);
    this.frame.outline(this.colors.red);
    circle = new Circle(LAYER_RADAR_DECORATION);
    this.addChild(circle);
    size = diameter * large;
    position = (diameter - size) / 2;
    circle.setSize(size);
    circle.outline(this.colors.grey);
    circle.setPosition(position, position);
    circle = new Circle(LAYER_RADAR_DECORATION);
    this.addChild(circle);
    size = diameter * medium;
    position = (diameter - size) / 2;
    circle.setSize(size);
    circle.outline(this.colors.grey);
    circle.setPosition(position, position);
    circle = new Circle(LAYER_RADAR_DECORATION);
    this.addChild(circle);
    size = diameter * small;
    position = (diameter - size) / 2;
    circle.setSize(size);
    circle.outline(this.colors.grey);
    circle.setPosition(position, position);
    center = this.frame.getCenter();
    numberOfSpokes = 24;
    increment = 360 / numberOfSpokes;
    length = (diameter / 2) * large;
    angle = 0;
    for (i = j = 0, ref = numberOfSpokes - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      offset = i % 3 !== 0 ? medium / large : small;
      line = new Line(LAYER_RADAR_DECORATION);
      this.addChild(line);
      line.from(center).atAngle(angle, length, offset);
      line.setColor(this.colors.grey);
      angle += increment;
    }
  }

  return Radar;

})(Pane);
