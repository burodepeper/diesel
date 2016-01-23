var CONTEXT, Circle, Color, Controller, DEBUG, Engine, EngineDebugPane, Entity, FONT_9PX, Font, Line, NOW, PX, Pane, Particle, Path, Point, Polygon, Rectangle, Sprite, Text, Timer, Tween, VisualEntity, WINDOW, addDiversity, average, delay, getRandomFromArray, getRandomFromObject, getRandomInt, getWeighedInt, isPoint, shuffle, snap,
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
  } else if ((gravity === "middle") || (gravity === "center")) {
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
  _numberOfEntities: 0,
  _numberOfEntitiesAdded: 0,
  _numberOfEntitiesRemoved: 0,
  _numberOfCleanUps: 0,
  _capacity: [],
  _context: null,
  _canvas: null,
  _size: {
    width: null,
    height: null
  },
  config: {
    debug: false,
    viewport: {
      width: null,
      height: null,
      grid: false
    }
  },
  isTouchDevice: 'ontouchstart' in document.documentElement,
  init: function(settings) {
    var i, k;
    if (this._createCanvas()) {
      if (settings.viewport.width) {
        this.config.viewport.width = settings.viewport.width;
      }
      if (settings.viewport.height) {
        this.config.viewport.height = settings.viewport.height;
      }
      if (settings.viewport.grid) {
        this.config.viewport.grid = settings.viewport.grid;
      }
      if (settings.debug) {
        this.config.debug = settings.debug;
      }
      window.WINDOW = new Pane(1);
      for (i = k = 1; k <= 60; i = ++k) {
        this._capacity.push(1);
      }
      this.trigger('resize');
      if (this.config.debug) {
        this._debugPane = new EngineDebugPane();
      }
      this._run();
      return true;
    } else {
      return false;
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
    this._numberOfEntitiesAdded++;
  },
  remove: function(entity) {
    if (this._entities[entity._layer]) {
      if (this._entities[entity._layer][entity._id]) {
        delete this._entities[entity._layer][entity._id];
        this._numberOfEntitiesRemoved++;
      } else {
        console.info("Engine.remove(): entity[" + entity._layer + "][" + entity._id + "] doesn't exist");
      }
    } else {
      console.warn("Engine.remove(): layer[" + entity._layer + "] doesn't exist");
    }
  },
  trigger: function(eventType) {
    window.dispatchEvent(new Event(eventType));
  },
  _run: function(timeElapsed) {
    if (timeElapsed == null) {
      timeElapsed = 0;
    }
    window.NOW = new Date().getTime();
    Engine._update();
    Engine._draw();
    Engine._check();
    Engine._capacity.shift();
    Engine._capacity.push(new Date().getTime() - NOW);
    window.requestAnimationFrame(Engine._run);
  },
  _check: function() {
    if (this._numberOfEntitiesRemoved >= 1000) {
      this.cleanUp();
      return this._numberOfCleanUps++;
    }
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
    if (this.config.viewport.grid) {
      this._drawGrid();
    }
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
  _drawGrid: function() {
    var bottom, k, l, left, ref, ref1, right, top, x, y;
    CONTEXT.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    CONTEXT.beginPath();
    top = 0;
    bottom = this._size.height * PX;
    for (x = k = 1, ref = this._size.width - 1; 1 <= ref ? k <= ref : k >= ref; x = 1 <= ref ? ++k : --k) {
      left = x * PX;
      CONTEXT.moveTo(left, top);
      CONTEXT.lineTo(left, bottom);
    }
    left = 0;
    right = this._size.width * PX;
    for (y = l = 1, ref1 = this._size.height - 1; 1 <= ref1 ? l <= ref1 : l >= ref1; y = 1 <= ref1 ? ++l : --l) {
      top = y * PX;
      CONTEXT.moveTo(left, top);
      CONTEXT.lineTo(right, top);
    }
    CONTEXT.stroke();
    return CONTEXT.closePath();
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
    var cleanedEntities, entity, i, j, k, l, layer, len, len1, numberOfEntities, ref;
    numberOfEntities = 0;
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
            numberOfEntities++;
          }
        }
        this._entities[i] = cleanedEntities;
      }
    }
    this._numberOfEntitiesRemoved = 0;
    this._numberOfEntities = numberOfEntities;
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
  },
  getCapacity: function() {
    var k, len, max, ref, sum, value;
    sum = 0;
    max = 0;
    ref = this._capacity;
    for (k = 0, len = ref.length; k < len; k++) {
      value = ref[k];
      sum += value;
      if (value > max) {
        max = value;
      }
    }
    return {
      capacity: sum / 1000,
      max: max
    };
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

  Color.prototype._r = 255;

  Color.prototype._g = 255;

  Color.prototype._b = 255;

  function Color(color) {
    if (color == null) {
      color = '#fff';
    }
    Color.__super__.constructor.call(this);
    this.set(color);
    this._tweenR = null;
    this._tweenG = null;
    this._tweenB = null;
  }

  Color.prototype.set = function(color) {
    color = this._parse(color);
    if (color) {
      this._r = color.r;
      this._g = color.g;
      this._b = color.b;
      return true;
    } else {
      return false;
    }
  };

  Color.prototype.get = function(opacity) {
    if (opacity == null) {
      opacity = 1;
    }
    return "rgba(" + this._r + ", " + this._g + ", " + this._b + ", " + opacity + ")";
  };

  Color.prototype.change = function(color, duration, easing) {
    if (duration == null) {
      duration = 1000;
    }
    if (easing == null) {
      easing = 'linear';
    }
    color = this._parse(color);
    if (color) {
      if (color.r !== this._r) {
        this._changeR(color.r, duration, easing);
      }
      if (color.g !== this._g) {
        this._changeG(color.g, duration, easing);
      }
      if (color.b !== this._b) {
        this._changeB(color.b, duration, easing);
      }
    }
  };

  Color.prototype._changeR = function(value, duration, easing) {
    var parameters;
    if (duration == null) {
      duration = 1000;
    }
    if (easing == null) {
      easing = 'linear';
    }
    parameters = [];
    parameters.push({
      name: 'value',
      from: this._r,
      to: value
    });
    this._tweenR = new Tween(parameters, duration, easing);
  };

  Color.prototype._changeG = function(value, duration, easing) {
    var parameters;
    if (duration == null) {
      duration = 1000;
    }
    if (easing == null) {
      easing = 'linear';
    }
    parameters = [];
    parameters.push({
      name: 'value',
      from: this._g,
      to: value
    });
    this._tweenG = new Tween(parameters, duration, easing);
  };

  Color.prototype._changeB = function(value, duration, easing) {
    var parameters;
    if (duration == null) {
      duration = 1000;
    }
    if (easing == null) {
      easing = 'linear';
    }
    parameters = [];
    parameters.push({
      name: 'value',
      from: this._b,
      to: value
    });
    this._tweenB = new Tween(parameters, duration, easing);
  };

  Color.prototype._parse = function(color) {
    var b, g, r;
    color = color.replace(/[ ]+/g, '').toLowerCase();
    if ((color.length === 7) && color.match(/#[0-9a-f]{6}/)) {
      r = parseInt(color.substring(1, 3), 16);
      g = parseInt(color.substring(3, 5), 16);
      b = parseInt(color.substring(5, 7), 16);
      return {
        r: r,
        g: g,
        b: b
      };
    } else if ((color.length === 4) && color.match(/#[0-9a-f]{3}/)) {
      r = parseInt(color.substring(1, 2), 16);
      g = parseInt(color.substring(2, 3), 16);
      b = parseInt(color.substring(3, 4), 16);
      r = (r * 16) + r;
      g = (g * 16) + g;
      b = (b * 16) + b;
      return {
        r: r,
        g: g,
        b: b
      };
    } else {
      console.log("Color.set()", color + "' is not valid");
      return false;
    }
  };

  Color.prototype._update = function() {
    if (this._tweenR) {
      this._r = Math.round(this._tweenR.getValue('value'));
      if (this._tweenR.isComplete) {
        this._tweenR = null;
      }
    }
    if (this._tweenG) {
      this._g = Math.round(this._tweenG.getValue('value'));
      if (this._tweenG.isComplete) {
        this._tweenG = null;
      }
    }
    if (this._tweenB) {
      this._b = Math.round(this._tweenB.getValue('value'));
      if (this._tweenB.isComplete) {
        this._tweenB = null;
      }
    }
  };

  return Color;

})(Entity);

Controller = (function(superClass) {
  extend(Controller, superClass);

  function Controller() {
    Controller.__super__.constructor.call(this);
  }

  return Controller;

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
    this._relativeTo = null;
    this._angle = null;
    this._distance = null;
    this._offset = null;
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
      easing = 'ease-in-out';
    }
    if (this.isValid(x, y)) {
      this.moveToX(x, duration, easing);
      this.moveToY(y, duration, easing);
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
      easing = 'ease-in-out';
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

  Point.prototype.relativeTo = function(point) {
    return this._relativeTo = point;
  };

  Point.prototype.atAngle = function(angle, distance) {
    this._angle = angle;
    return this._distance = distance;
  };

  Point.prototype.atOffset = function(x, y) {
    if (this.isValid(x, y)) {
      return this._offset = {
        x: x,
        y: y
      };
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
    this._updatePosition();
  };

  Point.prototype._setReference = function(_reference) {
    this._reference = _reference;
  };

  Point.prototype._updatePosition = function() {
    this._position.x = this.getX();
    this._position.y = this.getY();
    this.hasChanged = true;
    this._positionHasChanged = true;
    return true;
  };

  return Point;

})(Entity);

VisualEntity = (function(superClass) {
  extend(VisualEntity, superClass);

  function VisualEntity() {
    return VisualEntity.__super__.constructor.apply(this, arguments);
  }

  VisualEntity.prototype.isVisible = function() {
    if (this._reference) {
      return this._isVisible && this._reference.isVisible();
    } else {
      return this._isVisible;
    }
  };

  VisualEntity.prototype.setVisibility = function(visibility) {
    if (visibility) {
      this._isVisible = true;
    } else {
      this._isVisible = false;
    }
  };

  VisualEntity.prototype.show = function() {
    this.setVisibility(true);
    return this;
  };

  VisualEntity.prototype.hide = function() {
    this.setVisibility(false);
    return this;
  };

  VisualEntity.prototype.setOpacity = function(opacity) {
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
    this._opacity = opacity;
  };

  VisualEntity.prototype.getOpacity = function() {
    return this._opacity;
  };

  VisualEntity.prototype.setColor = function(color, opacity) {
    if (opacity == null) {
      opacity = null;
    }
    if (typeof color === 'object') {
      this._color = color;
    } else {
      this._color.set(color);
    }
    if (opacity != null) {
      this.setOpacity(opacity);
    }
  };

  VisualEntity.prototype._init = function() {
    this._opacity = 1;
    if (this._reference) {
      this._color = this._reference.getColor();
      return this._isVisible = this._reference.isVisible();
    } else {
      this._color = new Color('#fff');
      return this._isVisible = true;
    }
  };

  return VisualEntity;

})(Point);

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
    this._dimensions = {
      width: 0,
      height: 0,
      surface: 0,
      circumference: 0,
      center: {
        x: 0,
        y: 0
      }
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
    this._init();
  }

  Pane.prototype.setSize = function(width, height) {
    this._dimensions.width = width;
    this._dimensions.height = height;
    this._updateDimensions();
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
      this._css[key] = value;
    }
  };

  Pane.prototype.getWidth = function() {
    return this._dimensions.width;
  };

  Pane.prototype.getHeight = function() {
    return this._dimensions.height;
  };

  Pane.prototype.getCenter = function() {
    return this._dimensions.center;
  };

  Pane.prototype.getSurface = function() {
    return this._dimensions.surface;
  };

  Pane.prototype.getCircumference = function() {
    return this._dimensions.circumference;
  };

  Pane.prototype.getColor = function() {
    return this._color;
  };

  Pane.prototype.onResize = function() {
    var height, ref, width, x, y;
    if (this.hasCSS) {
      x = this.getX();
      y = this.getY();
      ref = this._dimensions, width = ref.width, height = ref.height;
      if (this._css.width) {
        width = this._css.width;
      }
      if (this._css.height) {
        height = this._css.height;
      }
      if ((this._css.left === 'center') && width) {
        x = Math.floor((this._reference.getWidth() - width) / 2);
      } else if ((this._css.left != null) && (this._css.right != null)) {
        width = this._reference.getWidth() - this._css.left - this._css.right;
        x = this._css.left;
      } else if (this._css.left != null) {
        x = this._css.left;
      } else if ((this._css.right != null) && width) {
        x = this._reference.getWidth() - width - this._css.right;
      } else {
        console.warn("Pane.onResize()", this, "invalid horizontal positioning");
      }
      if ((this._css.top === 'center') && height) {
        y = Math.floor((this._reference.getHeight() - height) / 2);
      } else if ((this._css.top != null) && (this._css.bottom != null)) {
        height = this._reference.getHeight() - this._css.top - this._css.bottom;
        y = this._css.top;
      } else if (this._css.top != null) {
        y = this._css.top;
      } else if ((this._css.bottom != null) && height) {
        y = this._reference.getHeight() - height - this._css.bottom;
      } else {
        console.warn("Pane.onResize()", this, "invalid vertical positioning");
      }
      this.setPosition(x, y);
      return this.setSize(width, height);
    }
  };

  Pane.prototype._getNextId = function() {
    var id;
    if (this._particles.length && this._children.length) {
      id = this._particles.length + this._children.length - 1;
    } else if (this._particles.length || this._children.length) {
      id = this._particles.length + this._children.length;
    } else {
      id = 0;
    }
    return id;
  };

  Pane.prototype.addChild = function(child) {
    this._children.push(child);
    child._setReference(this);
  };

  Pane.prototype.getChild = function(num) {
    if (this._children[num] != null) {
      return this._children[num];
    } else {
      return false;
    }
  };

  Pane.prototype.addParticle = function(particle) {
    this._particles.push(particle);
    particle._setReference(this);
  };

  Pane.prototype.updateParticles = function(method, value) {
    var k, len, particle, ref;
    ref = this._particles;
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

  Pane.prototype.remove = function() {
    var child, k, l, len, len1, particle, ref, ref1;
    if (this._particles.length) {
      ref = this._particles;
      for (k = 0, len = ref.length; k < len; k++) {
        particle = ref[k];
        particle.remove();
      }
    }
    if (this._children.length) {
      ref1 = this._children;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        child = ref1[l];
        child.remove();
      }
    }
    return Pane.__super__.remove.call(this);
  };

  Pane.prototype._updateDimensions = function() {
    var height, width;
    width = this._dimensions.width;
    height = this._dimensions.height;
    if (width && height) {
      this._dimensions.surface = width * height;
      this._dimensions.circumference = (2 * width) + (2 * height);
    } else {
      if (width) {
        this._dimensions.surface = width;
        this._dimensions.circumference = width * 2;
        this._dimensions.height = 1;
      } else {
        this._dimensions.surface = height;
        this._dimensions.circumference = height * 2;
        this._dimensions.width = 1;
      }
    }
    this._dimensions.center = {
      x: (this._dimensions.width - 1) / 2,
      y: (this._dimensions.height - 1) / 2
    };
  };

  return Pane;

})(VisualEntity);

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
    this._size = {
      width: 1,
      height: 1
    };
    this._reference = WINDOW;
    this._init();
  }

  Particle.prototype.setSize = function(width, height) {
    return this._size = {
      width: width,
      height: height
    };
  };

  Particle.prototype._draw = function() {
    var height, left, top, width;
    if (this.isVisible() && this._color) {
      left = snap(this._position.x * PX);
      top = snap(this._position.y * PX);
      width = snap(this._size.width * PX);
      height = snap(this._size.height * PX);
      CONTEXT.fillStyle = this._color.get(this._reference.getOpacity() * this._opacity);
      CONTEXT.fillRect(left, top, width, height);
    }
  };

  Particle.prototype._setReference = function(reference, id) {
    Particle.__super__._setReference.call(this, reference, id);
    return this.setColor(reference.getColor());
  };

  return Particle;

})(VisualEntity);

Timer = (function(superClass) {
  extend(Timer, superClass);

  function Timer(_duration, _easing) {
    this._duration = _duration;
    this._easing = _easing != null ? _easing : 'linear';
    Timer.__super__.constructor.call(this);
    this._start = NOW;
    this._stop = this._start + this._duration;
    this.isComplete = false;
    this.percentage = 0;
    this.value = 0;
  }

  Timer.prototype._applyEasing = function() {
    var t;
    t = this.percentage;
    if (this._easing === 'linear') {
      return t;
    } else if (this._easing === 'ease-in') {
      return t * t;
    } else if (this._easing === 'ease-out') {
      return t * (2 - t);
    } else if (this._easing === 'ease-in-out') {
      if (t < 0.5) {
        return 2 * t * t;
      } else {
        return -1 + (4 - 2 * t) * t;
      }
    } else {
      return t;
    }
  };

  Timer.prototype._update = function() {
    if (!this.isComplete) {
      this.percentage = (NOW - this._start) / this._duration;
      this.value = this._applyEasing();
      if (this.percentage >= 1) {
        this.percentage = 1;
        this.isComplete = true;
        this.remove();
      }
    }
  };

  return Timer;

})(Entity);

Circle = (function(superClass) {
  extend(Circle, superClass);

  function Circle(_layer) {
    this._layer = _layer != null ? _layer : 1;
    Circle.__super__.constructor.call(this, this._layer);
    this._diameter = null;
    this._radius = null;
    this._center = new Point(0, 0);
    this.type = null;
    this.hasOutline = false;
    this._positionHasChanged = true;
    this._sizeHasChanged = true;
  }

  Circle.prototype.fill = function(color, opacity) {
    if (color == null) {
      color = null;
    }
    if (opacity == null) {
      opacity = null;
    }
    this.type = 'fill';
    if (color != null) {
      this.setColor(color, opacity);
    }
  };

  Circle.prototype.stretch = function(color, opacity) {
    if (color == null) {
      color = null;
    }
    if (opacity == null) {
      opacity = null;
    }
    this.type = 'stretch';
    if (color != null) {
      this.setColor(color, opacity);
    }
  };

  Circle.prototype.outline = function(color) {
    this.outlineColor = color;
    this.hasOutline = true;
  };

  Circle.prototype.setSize = function() {
    if (this._radius) {
      this._diameter = (this._radius * 2) - 1;
      this._dimensions.width = this._diameter;
      this._dimensions.height = this._diameter;
      this._updateDimensions();
    }
  };

  Circle.prototype._updateDimensions = function() {
    this._dimensions.circumference = Math.PI * this._diameter;
    this._dimensions.surface = Math.PI * (this._radius * this._radius);
  };

  Circle.prototype._updatePosition = function() {
    var x, y;
    if (this._radius) {
      x = this._center.getX() - this._radius + 1;
      y = this._center.getY() - this._radius + 1;
      this._updateDimensions();
      this._x = x;
      this._y = y;
      return Circle.__super__._updatePosition.call(this);
    }
  };

  Circle.prototype.setRadius = function(_radius) {
    this._radius = _radius;
    this._diameter = (this._radius * 2) - 1;
    return this._updatePosition();
  };

  Circle.prototype.setCenter = function(_center) {
    this._center = _center;
  };

  Circle.prototype._getMinY = function() {
    var angle, i, increment, k, l, minY, radians, ref, ref1, samples, x, y;
    minY = [];
    for (x = k = 0, ref = this._diameter - 1; 0 <= ref ? k <= ref : k >= ref; x = 0 <= ref ? ++k : --k) {
      minY.push(this._radius);
    }
    samples = Math.ceil(Math.PI * this._radius);
    increment = 180 / samples;
    angle = 0;
    for (i = l = 0, ref1 = samples; 0 <= ref1 ? l <= ref1 : l >= ref1; i = 0 <= ref1 ? ++l : --l) {
      radians = angle * (Math.PI / 180);
      x = Math.ceil(this._radius - 0.5 + (Math.cos(radians) * (this._radius - 1)));
      y = Math.ceil(this._radius - 0.5 - (Math.sin(radians) * (this._radius - 1))) - 1;
      if (y < minY[x - 1]) {
        minY[x - 1] = y;
      }
      angle += increment;
    }
    return minY;
  };

  Circle.prototype._update = function() {
    var _x, _y, diffX, diffY, distanceFromCenter, fromY, height, i, j, k, l, len, len1, len2, m, minY, o, p, particle, position, positions, q, ref, ref1, ref2, ref3, ref4, ref5, s, toY, x, y;
    this._updatePosition();
    if (this._sizeHasChanged || this._positionHasChanged) {
      if (this._center && this._radius) {
        i = 0;
        if (this.type === 'fill') {
          for (x = k = 0, ref = this._diameter; 0 <= ref ? k <= ref : k >= ref; x = 0 <= ref ? ++k : --k) {
            for (y = l = 0, ref1 = this._diameter; 0 <= ref1 ? l <= ref1 : l >= ref1; y = 0 <= ref1 ? ++l : --l) {
              diffX = x - this._radius;
              diffY = y - this._radius;
              distanceFromCenter = Math.sqrt((diffX * diffX) + (diffY * diffY));
              if (distanceFromCenter < this._radius) {
                particle = this.getParticle(i);
                particle.setPosition(x, y);
                particle.show();
                i++;
              }
            }
          }
        } else if (this.type === 'stretch') {
          minY = this._getMinY();
          for (x = m = 0, len = minY.length; m < len; x = ++m) {
            y = minY[x];
            height = this._diameter - (y * 2);
            particle = this.getParticle(i);
            particle.setPosition(x, y);
            particle.setSize(1, height);
            particle.show();
            i++;
          }
        }
        if (this.hasOutline) {
          minY = this._getMinY();
          fromY = this._radius - 1;
          for (x = o = 0, len1 = minY.length; o < len1; x = ++o) {
            toY = minY[x];
            if (x < this._radius) {
              if (fromY < toY) {
                fromY = toY;
              }
              if (x === this._diameter - 1) {
                toY = this._radius - 1;
              }
              for (y = p = ref2 = fromY, ref3 = toY; ref2 <= ref3 ? p <= ref3 : p >= ref3; y = ref2 <= ref3 ? ++p : --p) {
                _x = this._diameter - x - 1;
                _y = this._diameter - y - 1;
                positions = [];
                positions.push({
                  x: x,
                  y: y
                });
                if (_x >= this._radius) {
                  positions.push({
                    x: _x,
                    y: y
                  });
                }
                if (_y >= this._radius) {
                  positions.push({
                    x: x,
                    y: _y
                  });
                }
                if (_x >= this._radius && _y >= this._radius) {
                  positions.push({
                    x: _x,
                    y: _y
                  });
                }
                for (q = 0, len2 = positions.length; q < len2; q++) {
                  position = positions[q];
                  particle = this.getParticle(i);
                  particle.setPosition(position.x, position.y);
                  particle.setColor(this.outlineColor);
                  particle.show();
                  i++;
                }
              }
              fromY = toY - 1;
            }
          }
        }
        if ((this._particles.length - 1) > i) {
          for (j = s = ref4 = i, ref5 = this._particles.length - 1; ref4 <= ref5 ? s <= ref5 : s >= ref5; j = ref4 <= ref5 ? ++s : --s) {
            this.getParticle(j).hide();
          }
        }
        this._positionHasChanged = false;
        return this._sizeHasChanged = false;
      }
    }
  };

  return Circle;

})(Pane);

Font = (function() {
  function Font(name) {
    this.name = "FONT_" + name;
    if (window[this.name]) {
      this._loadFont();
    } else {
      console.error("Font(): '" + this.name + "' doesn't exist");
    }
  }

  Font.prototype._loadFont = function() {
    return this.data = window[this.name];
  };

  Font.prototype.getGlyph = function(glyph) {
    var data;
    if (this.data.glyphs[glyph] != null) {
      data = this._isValid(this.data.glyphs[glyph]);
      if (!data) {
        console.log("Font.getGlyph(): data for '" + glyph + "' in '" + this.name + "' is not valid");
      }
      return data;
    } else {
      console.warn("Font.getGlyph(): '" + glyph + "' not found in '" + this.name + "'");
      return false;
    }
  };

  Font.prototype.getHeight = function() {
    return this.data.height;
  };

  Font.prototype._isValid = function(data) {
    if (data.length % this.data.height === 0) {
      return {
        particles: data,
        width: data.length / this.data.height
      };
    } else {
      return false;
    }
  };

  return Font;

})();

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

  Line.prototype.getLength = function() {
    return this.length;
  };

  Line.prototype._calculateDimensions = function() {
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
    var i, increment, j, k, l, m, o, particle, ref, ref1, ref2, ref3, ref4, ref5, ref6, results, x, y;
    i = 0;
    this._calculateDimensions();
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
      for (j = o = ref5 = i, ref6 = this._particles.length - 1; ref5 <= ref6 ? o <= ref6 : o >= ref6; j = ref5 <= ref6 ? ++o : --o) {
        results.push(this.getParticle(j).hide());
      }
      return results;
    }
  };

  return Line;

})(Pane);

Path = (function(superClass) {
  extend(Path, superClass);

  function Path() {
    return Path.__super__.constructor.apply(this, arguments);
  }

  Path.prototype._points = [];

  Path.prototype._lines = [];

  Path.prototype.addPoint = function(point) {
    point = isPoint(point);
    if (point) {
      this._points.push(point);
      if (this._points.length > 1) {
        this._addLine();
      }
      return true;
    } else {
      console.warn("Path.addPoint()", point, "is not valid");
      return false;
    }
  };

  Path.prototype._addLine = function() {
    var line;
    this.a = this._points[this._points.length - 2];
    this.b = this._points[this._points.length - 1];
    line = new Line();
    line.from(this.a).to(this.b);
    this._lines.push(line);
    this.addChild(line);
  };

  return Path;

})(Pane);

Polygon = (function(superClass) {
  extend(Polygon, superClass);

  function Polygon() {
    Polygon.__super__.constructor.call(this);
    ({
      _numberOfSides: null,
      _center: null,
      _innerRadius: null,
      _outerRadius: null,
      _rotation: null
    });
  }

  Polygon.prototype.setCenter = function(center) {
    if (isPoint(center)) {
      return this._center = center;
    } else {
      console.warn("Polygon.setCenter(): ", center, "is not a valid {Point}");
      return false;
    }
  };

  Polygon.prototype.setRotation = function(degrees) {};

  Polygon.prototype.setRadius = function(radius) {
    return this.setOuterRadius(radius);
  };

  Polygon.prototype.setInnerRadius = function(radius) {
    if (typeof radius === "number") {
      if (radius > 0) {
        return this._innerRadius = radius;
      }
    }
  };

  Polygon.prototype.setOuterRadius = function(radius) {
    if (typeof radius === "number") {
      if (radius > 0) {
        return this._outerRadius = radius;
      }
    }
  };

  Polygon.prototype.setNumberOfSides = function(number) {
    number = parseInt(number);
    if (number >= 3) {
      return this._numberOfSides = number;
    } else {
      return false;
    }
  };

  Polygon.prototype._createLines = function() {
    var i, k, ref, results;
    if ((this._center != null) && (this._numberOfSides != null) && (this._outerRadius != null)) {
      if (this._innerRadius != null) {
        return console.log("inner and outer");
      } else {
        results = [];
        for (i = k = 1, ref = this._numberOfSides; 1 <= ref ? k <= ref : k >= ref; i = 1 <= ref ? ++k : --k) {
          results.push(console.log("Create point, relative to center"));
        }
        return results;
      }
    }
  };

  return Polygon;

})(Path);

Rectangle = (function(superClass) {
  extend(Rectangle, superClass);

  function Rectangle() {
    return Rectangle.__super__.constructor.apply(this, arguments);
  }

  Rectangle.prototype.type = null;

  Rectangle.prototype.constuctor = function(_layer) {
    this._layer = _layer != null ? _layer : 1;
    Rectangle.__super__.constuctor.call(this, this._layer);
    return this.hasOutline = false;
  };

  Rectangle.prototype.fill = function(color, opacity) {
    if (color == null) {
      color = null;
    }
    if (opacity == null) {
      opacity = null;
    }
    this.type = 'fill';
    if (color != null) {
      this.setColor(color, opacity);
    }
  };

  Rectangle.prototype.stretch = function(color, opacity) {
    if (color == null) {
      color = null;
    }
    if (opacity == null) {
      opacity = null;
    }
    this.type = 'stretch';
    if (color != null) {
      this.setColor(color, opacity);
    }
  };

  Rectangle.prototype.outline = function(color) {
    this.outlineColor = color;
    this.hasOutline = true;
  };

  Rectangle.prototype._update = function() {
    var i, j, k, l, m, o, particle, ref, ref1, ref2, ref3, ref4, ref5, results, results1, x, y;
    if (this.type === 'stretch') {
      particle = this.getParticle(0).show();
      particle.setPosition(0, 0);
      particle.setSize(this._dimensions.width, this._dimensions.height);
      i = 1;
      if ((this._particles.length - 1) > i) {
        results = [];
        for (j = k = ref = i, ref1 = this._particles.length - 1; ref <= ref1 ? k <= ref1 : k >= ref1; j = ref <= ref1 ? ++k : --k) {
          results.push(this.getParticle(j).hide());
        }
        return results;
      }
    } else if (this.type === 'fill') {
      i = 0;
      for (x = l = 0, ref2 = this._dimensions.width - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; x = 0 <= ref2 ? ++l : --l) {
        for (y = m = 0, ref3 = this._dimensions.height - 1; 0 <= ref3 ? m <= ref3 : m >= ref3; y = 0 <= ref3 ? ++m : --m) {
          particle = this.getParticle(i);
          particle.setPosition(x, y);
          particle.show();
          i++;
        }
      }
      if ((this._particles.length - 1) > i) {
        results1 = [];
        for (j = o = ref4 = i, ref5 = this._particles.length - 1; ref4 <= ref5 ? o <= ref5 : o >= ref5; j = ref4 <= ref5 ? ++o : --o) {
          results1.push(this.getParticle(j).hide());
        }
        return results1;
      }
    }
  };

  return Rectangle;

})(Pane);

Sprite = (function(superClass) {
  extend(Sprite, superClass);

  function Sprite(_layer) {
    this._layer = _layer != null ? _layer : 1;
    Sprite.__super__.constructor.call(this, this._layer);
  }

  Sprite.prototype.load = function(data1) {
    var i, j, k, l, n, particle, ref, ref1, ref2, results, value, x, y;
    this.data = data1;
    if (this._parseData()) {
      n = 0;
      for (i = k = 0, ref = this.data.particles.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
        value = this.data.particles.charAt(i);
        x = i % this.data.width;
        y = Math.floor(i / this.data.width);
        if (value !== '0') {
          particle = this.getParticle(n);
          particle.setColor(this.data.colors[value]);
          particle.setPosition(x, y);
          particle.show();
          n++;
        }
      }
      if ((this._particles.length - 1) > n) {
        results = [];
        for (j = l = ref1 = n, ref2 = this._particles.length - 1; ref1 <= ref2 ? l <= ref2 : l >= ref2; j = ref1 <= ref2 ? ++l : --l) {
          results.push(this.getParticle(j).hide());
        }
        return results;
      }
    } else {
      return console.error("Sprite.load(): Can't load Sprite, data is not valid", this.data);
    }
  };

  Sprite.prototype._parseData = function() {
    var height, i, k, ref, value;
    if ((this.data.particles != null) && (this.data.colors != null) && (this.data.width != null)) {
      if (this.data.particles.length % this.data.width === 0) {
        height = this.data.particles.length / this.data.width;
        this.setSize(this.data.width, height);
        for (i = k = 0, ref = this.data.particles.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
          value = this.data.particles.charAt(i);
          if (value !== '0') {
            if (this.data.colors[value] == null) {
              console.warn("Sprite.parseData():", value, "is not a valid color index");
              return false;
            }
          }
        }
      } else {
        console.warn("Sprite.parseData(): number of particles (" + this.data.particles.length + ") isn't a multiple of width (" + this.data.width + ")");
        return false;
      }
    }
    return true;
  };

  Sprite.prototype.update = function() {
    if (this.reference.hasChanged) {
      return Sprite.__super__.update.call(this);
    }
  };

  return Sprite;

})(Pane);

Text = (function(superClass) {
  extend(Text, superClass);

  function Text() {
    return Text.__super__.constructor.apply(this, arguments);
  }

  Text.prototype.setFont = function(font) {
    this.font = font;
  };

  Text.prototype.setText = function(text) {
    this._oldText = this._text;
    this._text = text + "";
    return this._drawGlyphs();
  };

  Text.prototype.setColor = function(color1) {
    this.color = color1;
  };

  Text.prototype._drawGlyphs = function() {
    var data, glyph, i, k, l, redundantGlyphs, ref, ref1, results, value, x, y;
    x = 0;
    y = 0;
    for (i = k = 0, ref = this._text.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      value = this._text.charAt(i);
      data = this.font.getGlyph(value);
      if (data) {
        data.colors = {
          1: this.color
        };
        glyph = this.getChild(i);
        if (!glyph) {
          glyph = new Sprite();
          this.addChild(glyph);
        }
        glyph.load(data);
        glyph.setPosition(x, y);
        x += glyph.getWidth() + 1;
      }
    }
    this.setSize(x - 1, this.font.getHeight());
    if (this._oldText && (this._oldText.length > this._text.length)) {
      redundantGlyphs = this._oldText.length - this._text.length;
      results = [];
      for (i = l = 0, ref1 = redundantGlyphs - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; i = 0 <= ref1 ? ++l : --l) {
        results.push(this.getChild(this._text.length + i).hide());
      }
      return results;
    }
  };

  return Text;

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

EngineDebugPane = (function(superClass) {
  extend(EngineDebugPane, superClass);

  function EngineDebugPane() {
    var bar, i, k;
    EngineDebugPane.__super__.constructor.call(this);
    this.setCSS({
      bottom: 2,
      left: 2,
      height: 6
    });
    this._capacity = [];
    for (i = k = 0; k <= 9; i = ++k) {
      bar = new Rectangle();
      this.addChild(bar);
      bar.setSize(2, 6);
      bar.setPosition(i * 3, 0);
      bar.stretch(new Color('#fff'));
      this._capacity.push(bar);
    }
  }

  EngineDebugPane.prototype._update = function() {
    var bar, capacity, i, k, results;
    capacity = Math.floor(Engine.getCapacity().capacity * 10);
    results = [];
    for (i = k = 0; k <= 9; i = ++k) {
      bar = this._capacity[i];
      if (i <= capacity) {
        results.push(bar.setOpacity(1));
      } else {
        results.push(bar.setOpacity(0.25));
      }
    }
    return results;
  };

  return EngineDebugPane;

})(Pane);

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
