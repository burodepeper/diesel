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
    }
  }
};
