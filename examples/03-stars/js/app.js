var App;

App = {
  init: function() {
    var settings;
    settings = {
      viewport: {
        height: 120
      }
    };
    if (Engine.init(settings)) {
      console.log("Something");
    }
  }
};
