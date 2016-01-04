var App, LAYER_BACKGROUND, LAYER_FOREGROUND, layer;

layer = 1;

LAYER_BACKGROUND = layer++;

LAYER_FOREGROUND = layer++;

App = {
  init: function() {
    var settings;
    settings = {
      viewport: {
        width: 100,
        height: 100
      }
    };
    if (Engine.init(settings)) {
      this.left = new Point(1, 1);
      this.right = new Point(98, 1);
      this.line = new Line(LAYER_FOREGROUND);
      this.line.from(this.left).to(this.right);
      delay(500, (function(_this) {
        return function() {
          return _this.left.moveTo(74, 49, 3500, 'ease-in-out');
        };
      })(this));
      delay(1500, (function(_this) {
        return function() {
          return _this.right.moveTo(24, 24, 2500, 'ease-in-out');
        };
      })(this));
    }
  }
};
