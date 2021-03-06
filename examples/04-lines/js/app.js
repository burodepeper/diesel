var App, Clock, SpectrumAnalyzer,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

App = {
  init: function() {
    var font, green, lowercase, numbers, punctuation, red, settings, spriteData, uppercase, white;
    settings = {
      viewport: {
        width: 480,
        height: 270
      }
    };
    if (Engine.init(settings)) {
      this.clock = new Clock();
      this.clock.setCSS({
        top: 5,
        left: 5,
        width: 59,
        height: 59
      });
      red = new Color('#e10');
      green = new Color('#5d0');
      white = new Color('#fff');
      this.rectangle = new Rectangle();
      this.rectangle.setPosition(120, 80);
      this.rectangle.setSize(120, 80);
      this.rectangle.stretch(red, 0.5);
      this.rectangle.outline(green);
      this.square = new Square();
      this.square.setPosition(160, 100);
      this.square.setSize(100);
      this.square.stretch(green, 0.5);
      this.square.outline(red);
      spriteData = {
        particles: '0010002120111110212000100',
        colors: {
          1: new Color('#fff'),
          2: new Color('#e10')
        },
        width: 5
      };
      this.star = new Sprite();
      this.star.load(spriteData);
      this.star.setPosition(100, 20);
      font = new Font('9PX');
      lowercase = new Text();
      lowercase.setFont(font);
      lowercase.setPosition(120, 20);
      lowercase.setColor(new Color('#fd0'));
      lowercase.setText('abcdefghijklmnopqrstuvwxyz');
      uppercase = new Text();
      uppercase.setFont(font);
      uppercase.setPosition(120, 29);
      uppercase.setColor(new Color('#5d0'));
      uppercase.setText('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      numbers = new Text();
      numbers.setFont(font);
      numbers.setPosition(120, 38);
      numbers.setColor(new Color('#05d'));
      numbers.setText('0123456789 david@burodepeper.nl');
      punctuation = new Text();
      punctuation.setFont(font);
      punctuation.setPosition(120, 47);
      punctuation.setColor(new Color('#c0c'));
      punctuation.setText(' !"#$%&' + "'" + '()*+,-./:;<=>?@[\\]^_`{|}~');
      this.analyzer = new SpectrumAnalyzer();
    }
  }
};

Clock = (function(superClass) {
  extend(Clock, superClass);

  function Clock() {
    Clock.__super__.constructor.call(this);
    this.createDial();
    this.hours = new Line();
    this.addChild(this.hours);
    this.hours.from(this.dial.center);
    this.minutes = new Line();
    this.addChild(this.minutes);
    this.minutes.from(this.dial.center);
    this.seconds = new Line();
    this.addChild(this.seconds);
    this.seconds.setColor(new Color('#e10'));
    this.seconds.from(this.dial.center);
  }

  Clock.prototype.update = function() {
    var hours, minutes, seconds, time;
    time = new Date();
    seconds = time.getSeconds();
    minutes = time.getMinutes() + (seconds / 60);
    hours = time.getHours() + (minutes / 60);
    hours = 360 * ((hours % 12) / 12);
    this.hours.atAngle(hours, 20);
    minutes = 360 * (minutes / 60);
    this.minutes.atAngle(minutes, 27.5);
    seconds = 360 * (seconds / 60);
    return this.seconds.atAngle(seconds, 24);
  };

  Clock.prototype.createDial = function() {
    var color, degrees, i, j, line, results;
    this.dial = new Circle(1);
    this.addChild(this.dial);
    this.dial.setSize(59);
    this.dial.stretch('rgba(255, 255, 255, 0.15)');
    this.dial.outline(new Color('rgba(255, 255, 255, 0.15)'));
    color = new Color('rgba(255, 255, 255, 0.3)');
    results = [];
    for (i = j = 0; j <= 11; i = ++j) {
      degrees = i * 30;
      line = new Line(2);
      this.addChild(line);
      line.from(this.dial.center).atAngle(degrees, this.dial.radius, 0.8);
      results.push(line.setColor(color));
    }
    return results;
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

})(Pane);
