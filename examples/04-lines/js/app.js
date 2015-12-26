var App, Clock, SpectrumAnalyzer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

App = {
  init: function() {
    var settings;
    settings = {
      viewport: {
        width: 240,
        height: 180
      }
    };
    if (Engine.init(settings)) {
      this.clock = new Clock();
      this.clock.setCSS({
        top: 1,
        right: 1,
        width: 59,
        height: 59
      });
      this.analyzer = new SpectrumAnalyzer();
    }
  }
};

Clock = (function(superClass) {
  extend(Clock, superClass);

  Clock.prototype.center = null;

  Clock.prototype.hours = null;

  Clock.prototype.minutes = null;

  function Clock() {
    Clock.__super__.constructor.call(this);
    this.center = new Point();
    this.hours = new Line();
    this.minutes = new Line();
    this.seconds = new Line();
    this.addChild(this.hours);
    this.addChild(this.minutes);
    this.addChild(this.seconds);
  }

  Clock.prototype.update = function() {
    var center, hours, minutes, seconds, time;
    center = this.getCenter();
    this.center.x = center.x;
    this.center.y = center.y;
    this.hours.from(this.center);
    this.minutes.from(this.center);
    this.seconds.from(this.center);
    time = new Date();
    seconds = time.getSeconds();
    minutes = time.getMinutes() + (seconds / 60);
    hours = time.getHours() + (minutes / 60);
    hours = 360 * ((hours % 12) / 12);
    this.hours.atAngle(hours, 20, 0.05);
    minutes = 360 * (minutes / 60);
    this.minutes.atAngle(minutes, 30, 0.0333);
    seconds = 360 * (seconds / 60);
    return this.seconds.atAngle(seconds, 25);
  };

  return Clock;

})(Pane);

SpectrumAnalyzer = (function(superClass) {
  extend(SpectrumAnalyzer, superClass);

  SpectrumAnalyzer.prototype.counter = 0;

  SpectrumAnalyzer.prototype.points = [];

  SpectrumAnalyzer.prototype.min = 0;

  SpectrumAnalyzer.prototype.max = 42;

  function SpectrumAnalyzer() {
    var center, i, increment, j, numberOfPoints, point, ref, x, y;
    SpectrumAnalyzer.__super__.constructor.call(this);
    this.pane = new Pane();
    this.pane.setCSS({
      left: 1,
      right: 1,
      bottom: 1,
      height: 43
    });
    this.width = this.pane.getWidth();
    this.height = this.pane.getHeight();
    numberOfPoints = Math.ceil(this.width / 21);
    increment = this.width / (numberOfPoints - 1);
    this.path = new Path();
    this.pane.addChild(this.path);
    x = 0;
    center = 21;
    for (i = j = 0, ref = numberOfPoints - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      y = center + Math.floor(10 - Math.random() * 20);
      point = new Point(x, y);
      this.path.addPoint(point);
      x += increment;
      this.points.push(point);
    }
  }

  SpectrumAnalyzer.prototype.update = function() {
    var j, len, point, r, ref, y;
    if ((this.counter % 2) === 1) {
      ref = this.points;
      for (j = 0, len = ref.length; j < len; j++) {
        point = ref[j];
        y = point.y;
        r = getRandomInt(this.min, this.max);
        if (r < y) {
          point.y -= 1;
        } else if (r > y) {
          point.y += 1;
        }
      }
    }
    return this.counter++;
  };

  return SpectrumAnalyzer;

})(Controller);
