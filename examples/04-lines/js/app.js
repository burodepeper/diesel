var App;

App = {
  init: function() {
    var settings;
    settings = {
      viewport: {
        width: 120,
        height: 90
      }
    };
    if (Engine.init(settings)) {
      this.left = new Point(1, 1);
      this.right = new Point(118, 1);
      this.line = new Line();
      this.line.from(this.left).to(this.right);
      this.left.moveTo(1, 88, 2000);
      delay(2000, (function(_this) {
        return function() {
          return _this.left.moveTo(1, 44, 2000);
        };
      })(this));
      delay(4000, (function(_this) {
        return function() {
          return _this.left.moveTo(1, 88, 2000);
        };
      })(this));
      this.right.moveTo(118, 88, 6000);
    }
  }
};
