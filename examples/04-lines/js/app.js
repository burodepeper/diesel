var App, SpectrumAnalyzer,
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
      this.analyzer = new SpectrumAnalyzer();
    }
  }
};

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
