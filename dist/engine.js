var BoundingBox, CONTEXT, Controller, DEBUG, Engine, Entity, NOW, PX, Pane, Particle, Storage, Timer, Tween, WINDOW, addDiversity, average, delay, getRandomFromArray, getRandomFromObject, getRandomInt, getWeighedInt, shuffle, snap,
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
    viewport: {
      width: null,
      height: null
    }
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
      this.run();
      return true;
    } else {
      return false;
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
    this.context.clearRect(0, 0, this.width * PX, this.height * PX);
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
      this.width = this.config.viewport.width;
      this.height = this.config.viewport.height;
    } else if (this.config.viewport.width) {
      this.px = Math.floor(this.windowWidth / this.config.viewport.width);
      this.width = this.config.viewport.width;
      this.height = Math.floor(this.windowHeight / this.px);
    } else if (this.config.viewport.height) {
      this.px = Math.floor(this.windowHeight / this.config.viewport.height);
      this.width = Math.floor(this.windowWidth / this.px);
      this.height = this.config.viewport.height;
    }
    window.PX = this.px;
    this.canvas.setAttribute('width', this.width * this.px);
    this.canvas.setAttribute('height', this.height * this.px);
    this.canvas.style.marginLeft = -((this.width * this.px) / 2) + 'px';
    this.canvas.style.marginTop = -((this.height * this.px) / 2) + 'px';
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

  Entity.prototype.setEntityID = function(_entityID) {
    this._entityID = _entityID;
  };

  Entity.prototype.setState = function(state, nextState) {
    this.state = state;
    this.nextState = nextState != null ? nextState : "idle";
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

  function Pane(_layer) {
    this._layer = _layer != null ? _layer : 0;
    Pane.__super__.constructor.call(this);
    this.reference = WINDOW;
    this.children = [];
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
    this.css = {
      top: null,
      right: null,
      bottom: null,
      left: null,
      width: null,
      height: null
    };
    this.opacity = 1;
    this.isVisible = true;
    this.hasCSS = false;
    this.hasBoundingBox = false;
    this.boundingBox = null;
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
    this.onResize();
  };

  Pane.prototype.setCSSProperty = function(key, value) {
    var validKeys;
    validKeys = ['top', 'right', 'bottom', 'left', 'width', 'height'];
    if (validKeys.indexOf(key) !== -1) {
      if (!(((key === 'top') || (key === 'left')) && value === 'center')) {
        value = parseInt(value);
      }
      this.css[key] = value;
    }
  };

  Pane.prototype.setOpacity = function(opacity) {
    if (opacity == null) {
      opacity = 1;
    }
    opacity = parseFloat(opacity);
    if (opacity === NaN) {
      opacity = 1;
    }
    if (opacity < 0) {
      opacity = 0;
    }
    if (opacity > 1) {
      opacity = 1;
    }
    this.opacity = opacity;
  };

  Pane.prototype.setReference = function(reference, _childID) {
    this.reference = reference;
    this._childID = _childID;
  };

  Pane.prototype.getWidth = function() {
    return this.size.width;
  };

  Pane.prototype.getHeight = function() {
    return this.size.height;
  };

  Pane.prototype.getX = function() {
    if (this.reference) {
      return this.reference.getX() + this.position.relative.x;
    } else {
      return this.position.relative.x;
    }
  };

  Pane.prototype.getY = function() {
    if (this.reference) {
      return this.reference.getY() + this.position.relative.y;
    } else {
      return this.position.relative.y;
    }
  };

  Pane.prototype.isWithinBounds = function(x, y, width, height) {
    if (x == null) {
      x = this.position.relative.x;
    }
    if (y == null) {
      y = this.position.relative.y;
    }
    if (width == null) {
      width = this.getWidth();
    }
    if (height == null) {
      height = this.getHeight();
    }
    if (this.reference) {
      if ((x >= 0) && (y >= 0)) {
        if ((x + width <= this.reference.getWidth()) && (y + height <= this.reference.getHeight())) {
          return true;
        }
      }
      return false;
    }
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
      if ((this.css.left === 'center') && width) {
        x = Math.floor((this.reference.getWidth() - width) / 2);
      } else if ((this.css.left != null) && (this.css.right != null)) {
        width = this.reference.getWidth() - this.css.left - this.css.right;
        x = this.css.left;
      } else if (this.css.left != null) {
        x = this.css.left;
      } else if ((this.css.right != null) && width) {
        x = this.reference.getWidth() - width - this.css.right;
      } else {
        console.warn("Pane.onResize()", this, "invalid horizontal positioning");
      }
      if ((this.css.top === 'center') && height) {
        y = Math.floor((this.reference.getHeight() - height) / 2);
      } else if ((this.css.top != null) && (this.css.bottom != null)) {
        height = this.reference.getHeight() - this.css.top - this.css.bottom;
        y = this.css.top;
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

  Pane.prototype.addChild = function(child) {
    this.children.push(child);
    child.setReference(this, this.children.length - 1);
    child.isVisible = this.isVisible;
  };

  Pane.prototype.enableBoundingBox = function(color) {
    this.hasBoundingBox = true;
    this.boundingBox = new BoundingBox();
    this.boundingBox.setColor(color);
    return this.addChild(this.boundingBox);
  };

  Pane.prototype.disableBoundingBox = function() {
    this.hasBoundingBox = false;
    if (this.boundingBox) {
      this.boundingBox.remove();
      return this.boundingBox = false;
    }
  };

  return Pane;

})(Entity);

Particle = (function(superClass) {
  extend(Particle, superClass);

  function Particle(_layer) {
    this._layer = _layer != null ? _layer : 1;
    Particle.__super__.constructor.call(this);
    this.position = {
      relative: {
        x: 0,
        y: 0
      },
      absolute: {
        x: 0,
        y: 0
      }
    };
    this.color = {
      r: 255,
      g: 255,
      b: 255,
      a: 1
    };
    this.size = {
      width: 1,
      height: 1
    };
    this.reference = WINDOW;
    this.isVisible = true;
  }

  Particle.prototype.setReference = function(reference, _particleID) {
    this.reference = reference;
    this._particleID = _particleID;
  };

  Particle.prototype.setPosition = function(x, y) {
    this.position.relative = {
      x: x,
      y: y
    };
  };

  Particle.prototype.setSize = function(width, height) {
    this.size = {
      width: width,
      height: height
    };
  };

  Particle.prototype.setOpacity = function(opacity) {
    this.color.a = parseFloat(opacity);
  };

  Particle.prototype.setColor = function(color) {
    var b, g, match, r;
    color = color.replace(/[ ]+/g, '').toLowerCase();
    if ((color.length === 7) && color.match(/#[0-9a-f]{6}/)) {
      this.color.r = parseInt(color.substring(1, 3), 16);
      this.color.g = parseInt(color.substring(3, 5), 16);
      this.color.b = parseInt(color.substring(5, 7), 16);
    } else if ((color.length === 4) && color.match(/#[0-9a-f]{3}/)) {
      r = parseInt(color.substring(1, 2), 16);
      g = parseInt(color.substring(2, 3), 16);
      b = parseInt(color.substring(3, 4), 16);
      this.color.r = (r * 16) + r;
      this.color.g = (g * 16) + g;
      this.color.b = (b * 16) + b;
    } else if (match = color.match(/rgba\(([0-9]+),([0-9]+),([0-9]+),([\.0-9]+)\)/)) {
      this.color.r = parseInt(match[1]);
      this.color.g = parseInt(match[2]);
      this.color.b = parseInt(match[3]);
      this.color.a = parseFloat(match[4]);
    } else {
      console.log("Particle.setColor()", this, "color '" + color + "' is not valid");
    }
  };

  Particle.prototype.update = function() {
    this.position.absolute.x = this.reference.getX() + this.position.relative.x;
    this.position.absolute.y = this.reference.getY() + this.position.relative.y;
  };

  Particle.prototype.draw = function() {
    var height, left, top, width;
    if (this.isVisible && (this.color.a > 0)) {
      left = snap(this.position.absolute.x * PX);
      top = snap(this.position.absolute.y * PX);
      width = snap(this.size.width * PX);
      height = snap(this.size.height * PX);
      CONTEXT.fillStyle = this.getColor();
      CONTEXT.fillRect(left, top, width, height);
    }
  };

  Particle.prototype.getColor = function() {
    return "rgba(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ", " + this.color.a + ")";
  };

  Particle.prototype.show = function() {
    this.isVisible = true;
  };

  Particle.prototype.hide = function() {
    this.isVisible = false;
  };

  Particle.prototype.isWithinBounds = function() {
    return this.isWithinHorizontalBounds() && this.isWithinVerticalBounds();
  };

  Particle.prototype.isWithinHorizontalBounds = function(x) {
    var aboveLower, belowUpper;
    if (x == null) {
      x = this.position.relative.x;
    }
    aboveLower = x >= 0;
    belowUpper = x <= (this.reference.getWidth() - 1);
    return aboveLower && belowUpper;
  };

  Particle.prototype.isWithinVerticalBounds = function(y) {
    var aboveLower, belowUpper;
    if (y == null) {
      y = this.position.relative.y;
    }
    aboveLower = y >= 0;
    belowUpper = y <= (this.reference.getHeight() - 1);
    return aboveLower && belowUpper;
  };

  return Particle;

})(Entity);

Timer = (function(superClass) {
  extend(Timer, superClass);

  function Timer(duration, easing) {
    this.duration = duration;
    this.easing = easing != null ? easing : 'linear';
    Timer.__super__.constructor.call(this);
    this.start = NOW;
    this.stop = this.start + this.duration;
    this.isComplete = false;
    this.percentage = 0;
    this.value = 0;
  }

  Timer.prototype.update = function() {
    if (!this.isComplete) {
      this.percentage = (NOW - this.start) / this.duration;
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
    if (this.value >= 0) {
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

BoundingBox = (function(superClass) {
  extend(BoundingBox, superClass);

  BoundingBox.prototype.color = '#000';

  function BoundingBox() {
    BoundingBox.__super__.constructor.call(this, 1);
  }

  BoundingBox.prototype.setColor = function(color1) {
    this.color = color1;
  };

  BoundingBox.prototype.update = function() {
    this.left = this.reference.getX() * PX;
    this.top = this.reference.getY() * PX;
    this.right = this.left + (this.reference.getWidth() * PX);
    return this.bottom = this.top + (this.reference.getHeight() * PX);
  };

  BoundingBox.prototype.draw = function() {
    CONTEXT.strokeStyle = this.color;
    CONTEXT.beginPath();
    CONTEXT.moveTo(this.left - 1, this.top - 1);
    CONTEXT.lineTo(this.right + 1, this.top - 1);
    CONTEXT.lineTo(this.right + 1, this.bottom + 1);
    CONTEXT.lineTo(this.left - 1, this.bottom + 1);
    CONTEXT.lineTo(this.left - 1, this.top - 1);
    CONTEXT.closePath();
    CONTEXT.stroke();
  };

  return BoundingBox;

})(Pane);
