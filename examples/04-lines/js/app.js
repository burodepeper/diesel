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

  function SpectrumAnalyzer() {
    SpectrumAnalyzer.__super__.constructor.call(this);
    this.pane = new Pane();
    this.pane.setCSS({
      left: 1,
      right: 1,
      bottom: 1,
      height: 43
    });
  }

  return SpectrumAnalyzer;

})(Controller);
