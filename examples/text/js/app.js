var App, LAYER_BACKGROUND, LAYER_FOREGROUND, layer;

layer = 1;

LAYER_BACKGROUND = layer++;

LAYER_FOREGROUND = layer++;

App = {
  init: function() {
    var settings;
    settings = {
      debug: true,
      viewport: {
        width: 320,
        height: 180
      }
    };
    if (Engine.init(settings)) {
      this.color = new Color('#fff');
      this.font = new Font("9PX");
      this.text = new Text(LAYER_FOREGROUND);
      this.text.setFont(this.font);
      this.text.setPosition(10, 10);
      this.text.setColor(this.color);
      this.text.setText('apple');
    }
  }
};
