var App, Radar,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

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
      console.log("Engine check");
      this.radar = new Radar();
      this.radar.setSize(200, 200);
      this.radar.setPosition(20, 20);
      this.radar.enableBoundingBox();
    }
  }
};

Radar = (function(superClass) {
  extend(Radar, superClass);

  function Radar() {
    var red;
    Radar.__super__.constructor.call(this);
    red = new Color('#e10');
    this.frame = new Circle();
    this.addChild(this.frame);
    this.frame.setSize(200);
    this.frame.outline(red);
  }

  return Radar;

})(Pane);
