var App;

App = {
  init: function() {
    var settings;
    settings = {
      viewport: {
        width: 480,
        height: 270
      }
    };
    Engine.init(settings);
    this.leftPane = new Pane();
    this.leftPane.setCSS({
      left: 0,
      top: 0,
      bottom: 0,
      width: 160
    });
    this.centerPane = new Pane();
    this.centerPane.setCSS({
      left: 160,
      top: 0,
      bottom: 0,
      width: 160
    });
    this.rightPane = new Pane();
    this.rightPane.setCSS({
      right: 0,
      top: 0,
      bottom: 0,
      width: 160
    });
    console.log(this.centerPane);
    this.centerPane.onResize();
  }
};
