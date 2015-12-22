var CONTEXT, Controller, DEBUG, Engine, Entity, NOW, PX, Pane, Storage, Timer, Tween, WINDOW, addDiversity, average, delay, getRandomFromArray, getRandomFromObject, getRandomInt, getWeighedInt, shuffle, snap,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

snap = function(value) {
  return Math.round(value / PX) * PX;
};

delay = function(ms, func) {
  return setTimeout(func, ms);
};

getRandomInt = function(low, high) {
  var diff;
  diff = (high - low) + 1;
  diff = Math.random() * diff;
  return low + Math.floor(diff);
};

getWeighedInt = function(low, high, gravity, i) {
  var chance, diff, okay, r;
  r = Math.random();
  chance = Math.sqrt(Math.random());
  diff = (high - low) + 1;
  okay = false;
  if (gravity == null) {
    gravity = "high";
  }
  if (i == null) {
    i = 0;
  }
  if (gravity === "low") {
    if (chance >= r) {
      okay = true;
    }
  } else if (gravity === "high") {
    if (chance <= r) {
      okay = true;
    }
  } else if (gravity === "middle" || "center") {
    chance /= 2;
    if (r >= chance && r <= 1 - chance) {
      okay = true;
    }
  }
  if (okay) {
    return low + Math.floor(diff * r);
  } else {
    return getWeighedInt(low, high, gravity, i + 1);
  }
};

getRandomFromArray = function(array) {
  return array[getRandomInt(0, array.length - 1)];
};

getRandomFromObject = function(data) {
  var key, r, total, value;
  total = 0;
  for (key in data) {
    value = data[key];
    total += value;
    data[key] = total;
  }
  r = getRandomInt(1, total);
  for (key in data) {
    value = data[key];
    if (r <= value) {
      return key;
    }
  }
};

average = function(data) {
  var k, len, total, value;
  total = 0;
  for (k = 0, len = data.length; k < len; k++) {
    value = data[k];
    total += value;
  }
  return total / data.length;
};

shuffle = function(array) {
  var currentIndex, randomIndex, temporaryValue;
  currentIndex = array.length;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

addDiversity = function(value, diversity) {
  if (diversity == null) {
    diversity = 0.5;
  }
  return (value * (1 - diversity)) + (value * Math.random() * diversity * 2);
};

PX = 6;

CONTEXT = false;

WINDOW = false;

NOW = false;

DEBUG = false;

Engine = {
  config: {
    viewport: {}
  },
  entities: [],
  context: false,
  canvas: false,
  now: 0,
  px: 1,
  isTouchDevice: 'ontouchstart' in document.documentElement,
  init: function(settings) {
    if (this.createCanvas()) {
      if (settings.viewport.width) {
        this.config.viewport.width = settings.viewport.width;
      }
      if (settings.viewport.height) {
        this.config.viewport.height = settings.viewport.height;
      }
      window.WINDOW = new Pane();
      this.trigger('resize');
      return this.run();
    }
  },
  run: function(timeElapsed) {
    if (timeElapsed == null) {
      timeElapsed = 0;
    }
    this.now = new Date().getTime();
    window.NOW = this.now;
    Engine.update();
    Engine.draw();
    window.requestAnimationFrame(Engine.run);
  },
  update: function() {
    var entities, entity, k, l, len, len1, ref;
    ref = this.entities;
    for (k = 0, len = ref.length; k < len; k++) {
      entities = ref[k];
      if (entities) {
        for (l = 0, len1 = entities.length; l < len1; l++) {
          entity = entities[l];
          if (entity) {
            entity.update(this.now);
          }
        }
      }
    }
  },
  draw: function() {
    var entities, entity, i, k, l, len, len1, ref;
    this.context.clearRect(0, 0, this.width, this.height);
    ref = this.entities;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      entities = ref[i];
      if (i && entities) {
        for (l = 0, len1 = entities.length; l < len1; l++) {
          entity = entities[l];
          if (entity) {
            entity.draw(this.now);
          }
        }
      }
    }
  },
  addEntity: function(entity, layer) {
    if (layer == null) {
      layer = 0;
    }
    if (!this.entities[layer]) {
      this.entities[layer] = [];
    }
    entity.setEntityID(this.entities[layer].length);
    this.entities[layer].push(entity);
  },
  removeEntity: function(entity) {
    if (this.entities[entity._layer]) {
      if (this.entities[entity._layer][entity._entityID]) {
        delete this.entities[entity._layer][entity._entityID];
      }
    }
  },
  createCanvas: function() {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("id", "diesel-canvas");
    document.body.appendChild(this.canvas);
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '50%';
    this.canvas.style.left = '50%';
    this.context = this.canvas.getContext("2d");
    window.CONTEXT = this.context;
    window.addEventListener("resize", (function(_this) {
      return function() {
        _this.onResize();
      };
    })(this));
    return this.canvas && this.context;
  },
  onResize: function() {
    var viewportRatio;
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.windowRatio = this.windowWidth / this.windowHeight;
    if (this.config.viewport.width && this.config.viewport.height) {
      viewportRatio = this.config.viewport.width / this.config.viewport.height;
      if (viewportRatio >= this.windowRatio) {
        this.px = Math.floor(this.windowWidth / this.config.viewport.width);
      } else {
        this.px = Math.floor(this.windowHeight / this.config.viewport.height);
      }
      this.width = this.config.viewport.width * this.px;
      this.height = this.config.viewport.height * this.px;
    }
    window.PX = this.px;
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);
    this.canvas.style.marginLeft = -(this.width / 2) + 'px';
    this.canvas.style.marginTop = -(this.height / 2) + 'px';
    WINDOW.setSize(this.width, this.height);
  },
  trigger: function(eventType) {
    window.dispatchEvent(new Event(eventType));
  },
  cleanUp: function() {
    var cleanedEntities, entity, i, j, k, l, layer, len, len1, ref;
    ref = this.entities;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      layer = ref[i];
      if (layer && layer.length) {
        cleanedEntities = [];
        for (j = l = 0, len1 = layer.length; l < len1; j = ++l) {
          entity = layer[j];
          if (entity) {
            entity.setEntityID(cleanedEntities.length);
            cleanedEntities.push(entity);
          }
        }
        this.entities[i] = cleanedEntities;
      }
    }
  },
  diagnostics: function(verbose) {
    var efficiency, entity, i, j, k, l, layer, len, len1, numberOfEntitiesOnLayer, ref, totalNumberOfEntities, totalNumberOfPositions;
    if (verbose == null) {
      verbose = false;
    }
    if (verbose) {
      console.log("Engine.diagnostics()");
    }
    totalNumberOfPositions = 0;
    totalNumberOfEntities = 0;
    ref = this.entities;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      layer = ref[i];
      numberOfEntitiesOnLayer = 0;
      if (layer && layer.length) {
        totalNumberOfPositions += layer.length;
        for (j = l = 0, len1 = layer.length; l < len1; j = ++l) {
          entity = layer[j];
          if (entity) {
            numberOfEntitiesOnLayer++;
            totalNumberOfEntities++;
          }
        }
        if (verbose) {
          console.log("layer:" + i, "length:" + layer.length, "entities:" + numberOfEntitiesOnLayer);
        }
      }
    }
    efficiency = totalNumberOfEntities / totalNumberOfPositions;
    if (verbose) {
      console.log("-----");
      console.log(totalNumberOfEntities, "on", totalNumberOfPositions, "positions");
      console.log("efficiency:", Math.round(efficiency * 1000) / 10 + "%");
    }
    return efficiency;
  }
};

Entity = (function() {
  Entity.prototype._layer = 0;

  Entity.prototype.state = "idle";

  Entity.prototype.nextState = "idle";

  function Entity() {
    Engine.addEntity(this, this._layer);
  }

  Entity.prototype.update = function() {};

  Entity.prototype.draw = function() {};

  Entity.prototype.onResize = function() {};

  Entity.prototype.setEntityID = function(_entityID) {
    this._entityID = _entityID;
  };

  Entity.prototype.setState = function(state, nextState) {
    this.state = state;
    this.nextState = nextState != null ? nextState : "idle";
  };

  Entity.prototype.listenForResize = function() {
    window.addEventListener("resize", (function(_this) {
      return function() {
        _this.onResize();
      };
    })(this));
  };

  Entity.prototype.remove = function() {
    Engine.removeEntity(this);
  };

  return Entity;

})();

Controller = (function(superClass) {
  extend(Controller, superClass);

  function Controller() {
    Controller.__super__.constructor.call(this);
  }

  return Controller;

})(Entity);

Pane = (function(superClass) {
  extend(Pane, superClass);

  function Pane() {
    Pane.__super__.constructor.call(this);
    this.reference = WINDOW;
    this.position = {
      absolute: {
        x: 0,
        y: 0
      },
      relative: {
        x: 0,
        y: 0
      }
    };
    this.size = {
      width: 0,
      height: 0,
      surface: 0,
      circumference: 0
    };
    this.opacity = 1;
    this.children = [];
    this.css = {
      top: null,
      right: null,
      bottom: null,
      left: null,
      width: null,
      height: null
    };
    this.isVisible = true;
    this.hasCSS = false;
  }

  Pane.prototype.setPosition = function(x, y) {
    this.position.relative.x = x;
    this.position.relative.y = y;
  };

  Pane.prototype.setSize = function(width, height) {
    this.size.width = width;
    this.size.height = height;
    if (width && height) {
      this.size.surface = width * height;
      this.size.circumference = (2 * width) + (2 * height);
    } else {
      if (width) {
        this.size.surface = width;
        this.size.circumference = width * 2;
        this.size.height = 0;
      } else {
        this.size.surface = height;
        this.size.circumference = height * 2;
        this.size.width = 0;
      }
    }
  };

  Pane.prototype.setCSS = function(properties) {
    var name, value;
    for (name in properties) {
      value = properties[name];
      this.setCSSProperty(name, value);
    }
    this.hasCSS = true;
  };

  Pane.prototype.setCSSProperty = function(name, value) {
    if (!(((name === 'top') || (name === 'left')) && value === 'center')) {
      value = parseInt(value);
    }
    this.css[name] = value;
  };

  Pane.prototype.setOpacity = function(opacity) {
    this.opacity = opacity;
  };

  Pane.prototype.setReference = function(reference) {
    this.reference = reference;
  };

  Pane.prototype.getWidth = function() {
    return this.size.width;
  };

  Pane.prototype.getHeight = function() {
    return this.size.height;
  };

  Pane.prototype.onResize = function() {
    var height, ref, ref1, width, x, y;
    if (this.hasCSS) {
      ref = this.position.relative, x = ref.x, y = ref.y;
      ref1 = this.size, width = ref1.width, height = ref1.height;
      if (this.css.width) {
        width = this.css.width;
      }
      if (this.css.height) {
        height = this.css.height;
      }
      if ((this.css.left != null) && (this.css.right != null)) {
        width = this.reference.getWidth() - this.css.left - this.css.right;
        x = this.css.left;
      } else if ((this.css.left === 'center') && width) {
        x = Math.floor((this.reference.getWidth() - width) / 2);
      } else if (this.css.left != null) {
        x = this.css.left;
      } else if ((this.css.right != null) && width) {
        x = this.reference.getWidth() - width - this.css.right;
      } else {
        console.warn("Pane.onResize()", this, "invalid horizontal positioning");
      }
      if ((this.css.top != null) && (this.css.bottom != null)) {
        height = this.reference.getHeight() - this.css.top - this.css.bottom;
        y = this.css.top;
      } else if ((this.css.top === 'center') && height) {
        y = Math.floor((this.reference.getHeight() - height) / 2);
      } else if (this.css.top != null) {
        y = this.css.top;
      } else if ((this.css.bottom != null) && height) {
        y = this.reference.getHeight() - height - this.css.bottom;
      } else {
        console.warn("Pane.onResize()", this, "invalid vertical positioning");
      }
      this.setPosition(x, y);
      return this.setSize(width, height);
    }
  };

  return Pane;

})(Entity);

Timer = (function(superClass) {
  extend(Timer, superClass);

  function Timer(duration, easing) {
    this.duration = duration;
    this.easing = easing != null ? easing : 'linear';
    Timer.__super__.constructor.call(this);
    this.start = Engine.now;
    this.stop = this.start + this.duration;
    this.isComplete = false;
    this.percentage = 0;
    this.value = 0;
  }

  Timer.prototype.update = function(now) {
    if (now == null) {
      now = Engine.now;
    }
    if (!this.isComplete) {
      this.percentage = (now - this.start) / this.duration;
      this.value = this.applyEasing();
      if (this.percentage >= 1) {
        this.percentage = 1;
        this.isComplete = true;
        this.remove();
      }
    }
  };

  Timer.prototype.applyEasing = function() {
    var t;
    t = this.percentage;
    if (this.easing === 'linear') {
      return t;
    } else if (this.easing === 'ease-in') {
      return t * t;
    } else if (this.easing === 'ease-out') {
      return t * (2 - t);
    } else if (this.easing === 'ease-in-out') {
      if (t < 0.5) {
        return 2 * t * t;
      } else {
        return -1 + (4 - 2 * t) * t;
      }
    } else {
      return t;
    }
  };

  return Timer;

})(Entity);

Tween = (function(superClass) {
  extend(Tween, superClass);

  function Tween(data, duration, easing) {
    this.duration = duration;
    this.easing = easing != null ? easing : 'linear';
    Tween.__super__.constructor.call(this, this.duration, this.easing);
    this.parseParameters(data);
  }

  Tween.prototype.parseParameters = function(data) {
    var item, k, len;
    this.items = {};
    this.parameters = [];
    for (k = 0, len = data.length; k < len; k++) {
      item = data[k];
      this.parameters.push(item.name);
      this.items[item.name] = {
        from: item.from,
        to: item.to,
        difference: item.to - item.from,
        min: Math.min(item.from, item.to),
        max: Math.max(item.from, item.to)
      };
    }
  };

  Tween.prototype.getValue = function(name) {
    var item, value;
    item = this.items[name];
    if (this.value) {
      value = item.from + (this.value * item.difference);
      if (value < item.min) {
        value = item.min;
      }
      if (value > item.max) {
        value = item.max;
      }
    } else {
      value = item.min;
    }
    return value;
  };

  return Tween;

})(Timer);

Storage = (function() {
  function Storage(type) {
    this.type = type != null ? type : 'localStorage';
    this.storage = window[this.type];
    if (!this.isAvailable()) {
      console.warn(this.type, "is NOT available");
    }
  }

  Storage.prototype.isAvailable = function() {
    var error, x;
    try {
      x = '__storage_test__';
      this.storage.setItem(x, x);
      this.storage.removeItem(x);
      return true;
    } catch (_error) {
      error = _error;
      return false;
    }
  };

  Storage.prototype.get = function(key) {
    var value;
    value = this.storage.getItem(key);
    return value = JSON.parse(value);
  };

  Storage.prototype.set = function(key, value) {
    value = JSON.stringify(value);
    return this.storage.setItem(key, value);
  };

  return Storage;

})();
