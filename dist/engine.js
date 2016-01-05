var CONTEXT, Color, DEBUG, Engine, Entity, FONT_9PX, Line, NOW, PX, Pane, Particle, Point, Timer, Tween, WINDOW, addDiversity, average, delay, getRandomFromArray, getRandomFromObject, getRandomInt, getWeighedInt, isPoint, shuffle, snap,
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

isPoint = function(x, y) {
  if (typeof x === 'object') {
    if (x.constructor.name === 'Point') {
      return x;
    } else if ((x.x && typeof x.x === 'number') && (x.y && typeof x.y === 'number')) {
      return x;
    } else if (Array.isArray(x) && x.length === 2) {
      return new Point(x[0], x[1]);
    } else {
      return console.warn("isPoint()", x, "is not valid");
    }
  } else if ((typeof x === 'number') && (typeof y === 'number')) {
    return new Point(x, y);
  } else {
    console.warn("isPoint()", x + "," + y, "is not valid");
    return false;
  }
};

PX = 1;

CONTEXT = false;

WINDOW = false;

NOW = false;

DEBUG = false;

Engine = {
  _entities: [],
  _context: null,
  _canvas: null,
  _size: {
    width: null,
    height: null
  },
  config: {
    viewport: {
      width: null,
      height: null
    }
  },
  isTouchDevice: 'ontouchstart' in document.documentElement,
  init: function(settings) {
    if (this._createCanvas()) {
      if (settings.viewport.width) {
        this.config.viewport.width = settings.viewport.width;
      }
      if (settings.viewport.height) {
        this.config.viewport.height = settings.viewport.height;
      }
      window.WINDOW = new Pane(1);
      this.trigger('resize');
      this._run();
      return true;
    } else {
      return false;
    }
  },
  _run: function(timeElapsed) {
    if (timeElapsed == null) {
      timeElapsed = 0;
    }
    window.NOW = new Date().getTime();
    Engine._update();
    Engine._draw();
    window.requestAnimationFrame(Engine._run);
  },
  _update: function() {
    var entities, entity, k, l, len, len1, ref;
    ref = this._entities;
    for (k = 0, len = ref.length; k < len; k++) {
      entities = ref[k];
      if (entities) {
        for (l = 0, len1 = entities.length; l < len1; l++) {
          entity = entities[l];
          if (entity) {
            entity._update(NOW);
          }
        }
      }
    }
  },
  _draw: function() {
    var entities, entity, i, k, l, len, len1, ref;
    this._context.clearRect(0, 0, this._size.width * PX, this._size.height * PX);
    ref = this._entities;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      entities = ref[i];
      if (i && entities) {
        for (l = 0, len1 = entities.length; l < len1; l++) {
          entity = entities[l];
          if (entity) {
            entity._draw(NOW);
          }
        }
      }
    }
  },
  add: function(entity, layer) {
    if (layer == null) {
      layer = 0;
    }
    if (!this._entities[layer]) {
      this._entities[layer] = [];
    }
    entity._setId(this._entities[layer].length);
    this._entities[layer].push(entity);
  },
  remove: function(entity) {
    if (this._entities[entity._layer]) {
      if (this._entities[entity._layer][entity._id]) {
        delete this._entities[entity._layer][entity._id];
      } else {
        console.info("Engine.remove(): entity[" + entity._layer + "][" + entity._id + "] doesn't exist");
      }
    } else {
      console.warn("Engine.remove(): layer[" + entity._layer + "] doesn't exist");
    }
  },
  _createCanvas: function() {
    this._canvas = document.createElement("canvas");
    this._canvas.setAttribute("id", "diesel-canvas");
    document.body.appendChild(this._canvas);
    this._canvas.style.position = 'fixed';
    this._canvas.style.top = '50%';
    this._canvas.style.left = '50%';
    this._context = this._canvas.getContext("2d");
    window.CONTEXT = this._context;
    window.addEventListener("resize", (function(_this) {
      return function() {
        _this._onResize();
      };
    })(this));
    return this._canvas && this._context;
  },
  _onResize: function() {
    var px, viewportRatio;
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
    this.windowRatio = this.windowWidth / this.windowHeight;
    if (this.config.viewport.width && this.config.viewport.height) {
      viewportRatio = this.config.viewport.width / this.config.viewport.height;
      if (viewportRatio >= this.windowRatio) {
        px = Math.floor(this.windowWidth / this.config.viewport.width);
      } else {
        px = Math.floor(this.windowHeight / this.config.viewport.height);
      }
      this._size.width = this.config.viewport.width;
      this._size.height = this.config.viewport.height;
    } else if (this.config.viewport.width) {
      px = Math.floor(this.windowWidth / this.config.viewport.width);
      this._size.width = this.config.viewport.width;
      this._size.height = Math.floor(this.windowHeight / px);
    } else if (this.config.viewport.height) {
      px = Math.floor(this.windowHeight / this.config.viewport.height);
      this._size.width = Math.floor(this.windowWidth / px);
      this._size.height = this.config.viewport.height;
    }
    window.PX = px;
    this._canvas.setAttribute('width', this._size.width * px);
    this._canvas.setAttribute('height', this._size.height * px);
    this._canvas.style.marginLeft = -((this._size.width * px) / 2) + 'px';
    this._canvas.style.marginTop = -((this._size.height * px) / 2) + 'px';
    WINDOW.setSize(this._size.width, this._size.height);
  },
  trigger: function(eventType) {
    window.dispatchEvent(new Event(eventType));
  },
  getWidth: function() {
    return this._size.width;
  },
  getHeight: function() {
    return this._size.height;
  },
  analyze: function(focusOn) {
    var entity, i, inventory, k, l, layer, len, len1, name, ref;
    if (focusOn == null) {
      focusOn = -1;
    }
    inventory = {};
    ref = this._entities;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      layer = ref[i];
      if ((focusOn === i) || focusOn === -1) {
        for (l = 0, len1 = layer.length; l < len1; l++) {
          entity = layer[l];
          if (entity) {
            name = entity.constructor.name;
          } else {
            name = '(undefined)';
          }
          if (inventory[name] == null) {
            inventory[name] = 0;
          }
          inventory[name]++;
        }
      }
    }
    return inventory;
  },
  getAllInstancesOf: function(name, focusOn) {
    var entity, i, instanceName, instances, k, l, layer, len, len1, ref;
    if (focusOn == null) {
      focusOn = -1;
    }
    instances = [];
    ref = this._entities;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      layer = ref[i];
      if ((focusOn === i) || focusOn === -1) {
        for (l = 0, len1 = layer.length; l < len1; l++) {
          entity = layer[l];
          if (entity) {
            instanceName = entity.constructor.name;
            if (instanceName === name) {
              instances.push(entity);
            }
          }
        }
      }
    }
    return instances;
  },
  cleanUp: function() {
    var cleanedEntities, entity, i, j, k, l, layer, len, len1, ref;
    ref = this._entities;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      layer = ref[i];
      if (layer && layer.length) {
        cleanedEntities = [];
        for (j = l = 0, len1 = layer.length; l < len1; j = ++l) {
          entity = layer[j];
          if (entity) {
            entity._setId(cleanedEntities.length);
            cleanedEntities.push(entity);
          }
        }
        this._entities[i] = cleanedEntities;
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
    ref = this._entities;
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

  function Entity(layer) {
    if (layer == null) {
      layer = 0;
    }
    this._layer = layer;
    Engine.add(this, this._layer);
  }

  Entity.prototype._update = function() {};

  Entity.prototype._draw = function() {};

  Entity.prototype._setId = function(_id) {
    this._id = _id;
  };

  Entity.prototype.remove = function() {
    Engine.remove(this);
  };

  return Entity;

})();

Color = (function(superClass) {
  extend(Color, superClass);

  Color.prototype.r = 255;

  Color.prototype.g = 255;

  Color.prototype.b = 255;

  Color.prototype.a = 1;

  function Color(color, opacity) {
    if (color == null) {
      color = '#fff';
    }
    if (opacity == null) {
      opacity = null;
    }
    Color.__super__.constructor.call(this);
    this.set(color, opacity);
  }

  Color.prototype.set = function(color, opacity) {
    var b, g, match, r;
    if (opacity == null) {
      opacity = null;
    }
    color = color.replace(/[ ]+/g, '').toLowerCase();
    if ((color.length === 7) && color.match(/#[0-9a-f]{6}/)) {
      this.r = parseInt(color.substring(1, 3), 16);
      this.g = parseInt(color.substring(3, 5), 16);
      this.b = parseInt(color.substring(5, 7), 16);
      this.a = 1;
      if (opacity != null) {
        return this.setOpacity(opacity);
      }
    } else if ((color.length === 4) && color.match(/#[0-9a-f]{3}/)) {
      r = parseInt(color.substring(1, 2), 16);
      g = parseInt(color.substring(2, 3), 16);
      b = parseInt(color.substring(3, 4), 16);
      this.r = (r * 16) + r;
      this.g = (g * 16) + g;
      this.b = (b * 16) + b;
      this.a = 1;
      if (opacity != null) {
        return this.setOpacity(opacity);
      }
    } else if (match = color.match(/rgba\(([0-9]+),([0-9]+),([0-9]+),([\.0-9]+)\)/)) {
      this.r = parseInt(match[1]);
      this.g = parseInt(match[2]);
      this.b = parseInt(match[3]);
      this.a = parseFloat(match[4]);
      if (opacity != null) {
        return this.setOpacity(opacity);
      }
    } else {
      console.log("Color.set()", color + "' is not valid");
      return false;
    }
  };

  Color.prototype.setOpacity = function(opacity) {
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
    return this.a = opacity;
  };

  Color.prototype.setReference = function(reference1) {
    this.reference = reference1;
  };

  Color.prototype.toString = function() {
    return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
  };

  return Color;

})(Entity);

Point = (function(superClass) {
  extend(Point, superClass);

  function Point(x, y, _layer) {
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    this._layer = _layer != null ? _layer : 0;
    Point.__super__.constructor.call(this, this._layer);
    this._x = null;
    this._y = null;
    this._tweenX = null;
    this._tweenY = null;
    this._reference = null;
    this._position = {
      x: null,
      y: null
    };
    this.hasChanged = false;
    this.setPosition(x, y);
  }

  Point.prototype.getX = function() {
    if (this._reference) {
      return this._reference.getX() + this._x;
    } else {
      return this._x;
    }
  };

  Point.prototype.getY = function() {
    if (this._reference) {
      return this._reference.getY() + this._y;
    } else {
      return this._y;
    }
  };

  Point.prototype.isValid = function(x, y) {
    var _isValid;
    if (x == null) {
      x = this._x;
    }
    if (y == null) {
      y = this._y;
    }
    _isValid = (x !== NaN) && (y !== NaN);
    if (!_isValid) {
      console.warn("Point()", x + "," + y, "is not a valid Point");
    }
    return _isValid;
  };

  Point.prototype.moveTo = function(x, y, duration, easing) {
    if (duration == null) {
      duration = 1000;
    }
    if (easing == null) {
      easing = 'linear';
    }
    if (this.isValid(x, y)) {
      this.moveToX(x, duration, easing);
      this.moveToY(x, duration, easing);
      return true;
    } else {
      return false;
    }
  };

  Point.prototype.moveToX = function(x, duration, easing) {
    var parameters;
    if (duration == null) {
      duration = 1000;
    }
    if (easing == null) {
      easing = 'linear';
    }
    parameters = [];
    parameters.push({
      name: 'x',
      from: this._x,
      to: x
    });
    this._tweenX = new Tween(parameters, duration, easing);
  };

  Point.prototype.moveToY = function(y, duration, easing) {
    var parameters;
    if (duration == null) {
      duration = 1000;
    }
    if (easing == null) {
      easing = 'linear';
    }
    parameters = [];
    parameters.push({
      name: 'y',
      from: this._y,
      to: y
    });
    this._tweenY = new Tween(parameters, duration, easing);
  };

  Point.prototype.setPosition = function(x, y) {
    if (this.isValid(x, y)) {
      this._x = x;
      this._y = y;
      return this._updatePosition();
    } else {
      return false;
    }
  };

  Point.prototype.setX = function(x) {
    if (this.isValid(x)) {
      this._x = x;
      return this._updatePosition();
    } else {
      return false;
    }
  };

  Point.prototype.setY = function(y) {
    if (this.isValid(y)) {
      this._y = y;
      return this._updatePosition();
    } else {
      return false;
    }
  };

  Point.prototype._update = function() {
    var _previousX, _previousY;
    this.hasChanged = false;
    _previousX = this._x;
    _previousY = this._y;
    if (this._tweenX) {
      this._x = Math.round(this._tweenX.getValue('x'));
      if (this._tweenX.isComplete) {
        this._tweenX = null;
      }
    }
    if (this._tweenY) {
      this._y = Math.round(this._tweenY.getValue('y'));
      if (this._tweenY.isComplete) {
        this._tweenY = null;
      }
    }
    if ((_previousX !== this._x) || (_previousY !== this._y)) {
      this._updatePosition();
    }
  };

  Point.prototype._setReference = function(_reference, _id) {
    this._reference = _reference;
    this._id = _id;
  };

  Point.prototype._updatePosition = function() {
    this._position.x = this.getX();
    this._position.y = this.getY();
    this.hasChanged = true;
    return true;
  };

  return Point;

})(Entity);

Pane = (function(superClass) {
  extend(Pane, superClass);

  function Pane(_layer, x, y) {
    this._layer = _layer != null ? _layer : 1;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    Pane.__super__.constructor.call(this, x, y, this._layer);
    this._position = null;
    this._size = {
      width: 0,
      height: 0,
      surface: 0,
      circumference: 0
    };
    this._reference = WINDOW;
    this._children = [];
    this._particles = [];
    this._css = {
      top: null,
      right: null,
      bottom: null,
      left: null,
      width: null,
      height: null
    };
    this._isVisible = true;
  }

  Pane.prototype.setSize = function(width, height) {
    this._size.width = width;
    this._size.height = height;
    if (width && height) {
      this._size.surface = width * height;
      this._size.circumference = (2 * width) + (2 * height);
    } else {
      if (width) {
        this._size.surface = width;
        this._size.circumference = width * 2;
        this._size.height = 0;
      } else {
        this._size.surface = height;
        this._size.circumference = height * 2;
        this._size.width = 0;
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

  Pane.prototype.getWidth = function() {
    return this._size.width;
  };

  Pane.prototype.getHeight = function() {
    return this._size.height;
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
    child._setReference(this, this.children.length + this.particles.length - 1);
  };

  Pane.prototype.addParticle = function(particle) {
    this._particles.push(particle);
    particle._setReference(this, this._particles.length + this._children.length - 1);
    particle.color = this.color;
  };

  Pane.prototype.updateParticles = function(method, value) {
    var k, len, particle, ref;
    ref = this.particles;
    for (k = 0, len = ref.length; k < len; k++) {
      particle = ref[k];
      particle[method](value);
    }
  };

  Pane.prototype.getParticle = function(i) {
    var particle;
    if (this._particles[i]) {
      return this._particles[i];
    } else {
      particle = new Particle(this._layer);
      this.addParticle(particle);
      return particle;
    }
  };

  return Pane;

})(Point);

Particle = (function(superClass) {
  extend(Particle, superClass);

  function Particle(_layer, x, y) {
    this._layer = _layer != null ? _layer : 1;
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    Particle.__super__.constructor.call(this, x, y, this._layer);
    this._color = new Color('#fff');
    this._opacity = 1;
    this._size = {
      width: 1,
      height: 1
    };
    this._isVisible = true;
    this._reference = WINDOW;
  }

  Particle.prototype._setReference = function(reference, particleID) {
    return Particle.__super__._setReference.call(this, reference, particleID);
  };

  Particle.prototype.isVisible = function() {
    return this._isVisible;
  };

  Particle.prototype._draw = function() {
    var height, left, top, width;
    if (this.isVisible()) {
      left = snap(this._position.x * PX);
      top = snap(this._position.y * PX);
      width = snap(this._size.width * PX);
      height = snap(this._size.height * PX);
      CONTEXT.fillStyle = this._color;
      CONTEXT.fillRect(left, top, width, height);
    }
  };

  Particle.prototype.show = function() {
    this._isVisible = true;
    return this;
  };

  Particle.prototype.hide = function() {
    this._isVisible = false;
    return this;
  };

  return Particle;

})(Point);

Timer = (function(superClass) {
  extend(Timer, superClass);

  function Timer(duration1, easing1) {
    this.duration = duration1;
    this.easing = easing1 != null ? easing1 : 'linear';
    Timer.__super__.constructor.call(this);
    this.start = NOW;
    this.stop = this.start + this.duration;
    this.isComplete = false;
    this.percentage = 0;
    this.value = 0;
  }

  Timer.prototype._update = function() {
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

Line = (function(superClass) {
  extend(Line, superClass);

  function Line(_layer) {
    this._layer = _layer != null ? _layer : 1;
    Line.__super__.constructor.call(this, this._layer);
    this._from = null;
    this._to = null;
    this._angle = null;
    this.length = 0;
    this.offset = 0;
    this.weight = 1;
  }

  Line.prototype.from = function(x, y) {
    this._from = isPoint(x, y);
    if (!this._from) {
      console.warn("Line.from() is not valid");
    }
    return this;
  };

  Line.prototype.to = function(x, y) {
    this._to = isPoint(x, y);
    if (!this._to) {
      console.warn("Line.to() is not valid");
    }
    return this;
  };

  Line.prototype.atAngle = function(_angle, length, offset) {
    var degrees, radians, x, y;
    this._angle = _angle;
    this.length = length;
    this.offset = offset != null ? offset : 0;
    x = this._from.x;
    y = this._from.y;
    degrees = ((360 - this._angle) + 90) % 360;
    radians = degrees * (Math.PI / 180);
    x += Math.cos(radians) * this.length;
    y -= Math.sin(radians) * this.length;
    if (!this._to) {
      this._to = new Point(x, y);
    } else {
      this._to.x = x;
      this._to.y = y;
    }
    return this;
  };

  Line.prototype.calculateDimensions = function() {
    var x, y;
    if ((this._from != null) && (this._to != null)) {
      this.diffX = this._to.getX() - this._from.getX();
      this.diffY = this._to.getY() - this._from.getY();
      this.width = Math.abs(this.diffX);
      this.height = Math.abs(this.diffY);
      this.length = Math.sqrt((this.width * this.width) + (this.height * this.height));
      x = Math.min(this._to.getX(), this._from.getY());
      y = Math.min(this._to.getX(), this._from.getY());
      this.setSize(this.width, this.height);
    }
  };

  Line.prototype._update = function() {
    var i, increment, j, k, l, m, n, particle, ref, ref1, ref2, ref3, ref4, ref5, ref6, results, x, y;
    i = 0;
    this.calculateDimensions();
    if (Math.abs(this.diffX) >= Math.abs(this.diffY)) {
      y = this._from.getY();
      increment = this.diffY / Math.abs(this.diffX);
      for (x = k = ref = this._from.getX(), ref1 = this._to.getX(); ref <= ref1 ? k <= ref1 : k >= ref1; x = ref <= ref1 ? ++k : --k) {
        particle = this.getParticle(i);
        particle.setPosition(x, y);
        particle.show();
        y += increment;
        i++;
      }
    } else {
      x = this._from.getX();
      increment = this.diffX / Math.abs(this.diffY);
      for (y = l = ref2 = this._from.getY(), ref3 = this._to.getY(); ref2 <= ref3 ? l <= ref3 : l >= ref3; y = ref2 <= ref3 ? ++l : --l) {
        particle = this.getParticle(i);
        particle.setPosition(x, y);
        particle.show();
        x += increment;
        i++;
      }
    }
    if (this.offset) {
      for (j = m = 0, ref4 = Math.floor(i * this.offset); 0 <= ref4 ? m <= ref4 : m >= ref4; j = 0 <= ref4 ? ++m : --m) {
        this.getParticle(j).hide();
      }
    }
    if ((this._particles.length - 1) > i) {
      results = [];
      for (j = n = ref5 = i, ref6 = this._particles.length - 1; ref5 <= ref6 ? n <= ref6 : n >= ref6; j = ref5 <= ref6 ? ++n : --n) {
        results.push(this.getParticle(j).hide());
      }
      return results;
    }
  };

  return Line;

})(Pane);

Tween = (function(superClass) {
  extend(Tween, superClass);

  function Tween(data, duration1, easing1) {
    this.duration = duration1;
    this.easing = easing1 != null ? easing1 : 'linear';
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

FONT_9PX = {
  height: 9,
  glyphs: {
    ' ': '000000000000000000',
    '!': '111110100',
    '"': '101101000000000000000000000',
    '#': '010100101011111010101111101010010100000000000',
    '$': '001000111010101101000111000101101010111000100',
    '%': '010001010101010001000101010101000100000000000',
    '&': '011001001010000010001010110010011010000000000',
    "'": '110000000',
    '(': '001010100100100100100010001',
    ')': '100010001001001001001010100',
    '*': '000000000000100101010111010101001000000000000',
    '+': '000000000010111010000000000',
    ',': '000000000000011000',
    '-': '000000000000111000000000000',
    '.': '000000100',
    '/': '001001001010010010100100100',
    '0': '011010011001100110011001011000000000',
    '1': '010110010010010010111000000',
    '2': '111000010001001001001000111100000000',
    '3': '111000010001011000010001111000000000',
    '4': '001101010101100111110001000100000000',
    '5': '111110001000111000010001111000000000',
    '6': '011010001000111010011001011000000000',
    '7': '111100010010001001000100010000000000',
    '8': '011010011001011010011001011000000000',
    '9': '011010011001011100010001011000000000',
    ':': '000100100',
    ';': '000000010000011000',
    '<': '000000001010100010001000000',
    '=': '000000000111000111000000000',
    '>': '000000100010001010100000000',
    '?': '011101000100001000100010000000001000000000000',
    '@': '001110010001100111101001101001101001100110010000001110',
    'A': '001000101010001100011111110001100010000000000',
    'B': '111101000110001111101000110001111100000000000',
    'C': '011110001000100010001000011100000000',
    'D': '111101000110001100011000110001111100000000000',
    'E': '111110001000111010001000111100000000',
    'F': '111110001000111010001000100000000000',
    'G': '011101000110000100111000110001011100000000000',
    'H': '100011000110001111111000110001100010000000000',
    'I': '111010010010010010111000000',
    'J': '001110000100001000010000110001011100000000000',
    'K': '100011001010100110001010010010100010000000000',
    'L': '100010001000100010001000111100000000',
    'M': '100011101110101100011000110001100010000000000',
    'N': '100011100111001101011001110011100010000000000',
    'O': '011101000110001100011000110001011100000000000',
    'P': '111101000110001111101000010000100000000000000',
    'Q': '011101000110001100011000110001011100001000001',
    'R': '111101000110001111101010010010100010000000000',
    'S': '011101000110000011100000110001011100000000000',
    'T': '111110010000100001000010000100001000000000000',
    'U': '100011000110001100011000110001011100000000000',
    'V': '100011000110001010100101001010001000000000000',
    'W': '100011000110001101011010101010010100000000000',
    'X': '100011000101010001000101010001100010000000000',
    'Y': '100011000101010001000010000100001000000000000',
    'Z': '111110000100010001000100010000111110000000000',
    '[': '111010101010101011',
    '\\': '100100100010010010001001001',
    ']': '110101010101010111',
    '^': '010101000000000000000000000',
    '_': '000000000000000000000111000',
    '`': '100100000000000000',
    'a': '000000000110000101111001011100000000',
    'b': '100010001110100110011001111000000000',
    'c': '000000011100100100011000000',
    'd': '000100010111100110011001011100000000',
    'e': '000000000110100111101000011000000000',
    'f': '011011101010100000',
    'g': '000000000111100110011001011100010110',
    'h': '100010001110100110011001100100000000',
    'i': '101111100',
    'j': '010001010101010110',
    'k': '100010001001101011001010100100000000',
    'l': '101010101010010000',
    'm': '000000000011110101011010110101101010000000000',
    'n': '000000001110100110011001100100000000',
    'o': '000000000110100110011001011000000000',
    'p': '000000001110100110011001111010001000',
    'q': '000000000111100110011001011100010001',
    'r': '000001101010100000',
    's': '000000000111100001100001111000000000',
    't': '010010111010010010001000000',
    'u': '000000001001100110011001011000000000',
    'v': '000000000010001100010101001010001000000000000',
    'w': '000000000010001101011010110101010100000000000',
    'x': '000000000010001010100010001010100010000000000',
    'y': '000000000010001100010101001010001000010001000',
    'z': '000000000011111000100010001000111110000000000',
    '{': '001010010010100010010010001',
    '|': '111101111',
    '}': '100010010010001010010010100',
    '~': '000000000000000010001010100010000000000000000'
  }
};
