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
    var angle, center, circle, i, increment, j, length, line, numberOfSpokes, offset, ref;
    Radar.__super__.constructor.call(this);
    this.frame = new Circle(LAYER_RADAR_DECORATION);
    this.addChild(this.frame);
    this.frame.setSize(200);
    this.frame.outline(this.colors.red);
    circle = new Circle(LAYER_RADAR_DECORATION);
    this.addChild(circle);
    circle.setSize(200 * 0.9);
    circle.outline(this.colors.grey);
    circle.setPosition(10, 10);
    circle = new Circle(LAYER_RADAR_DECORATION);
    this.addChild(circle);
    circle.setSize(200 * 0.5);
    circle.outline(this.colors.grey);
    circle.setPosition(50, 50);
    circle = new Circle(LAYER_RADAR_DECORATION);
    this.addChild(circle);
    circle.setSize(200 * 0.1);
    circle.outline(this.colors.grey);
    circle.setPosition(90, 90);
    center = this.frame.getCenter();
    numberOfSpokes = 24;
    increment = 360 / numberOfSpokes;
    length = 90;
    angle = 0;
    for (i = j = 0, ref = numberOfSpokes - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      angle += increment;
      offset = i % 2 ? 0.556 : 0.1;
      line = new Line(LAYER_RADAR_DECORATION);
      this.addChild(line);
      line.from(center).atAngle(angle, length, offset);
      line.setColor(this.colors.grey);
    }
  }

  return Radar;

})(Pane);
