var BoundingBox, CONTEXT, Circle, Color, Controller, DEBUG, Engine, Entity, FONT_9PX, Font, Line, NOW, PX, Pane, Particle, Path, Point, Rectangle, Sprite, Square, Storage, Text, Timer, Tween, WINDOW, addDiversity, average, delay, getRandomFromArray, getRandomFromObject, getRandomInt, getWeighedInt, isPoint, shuffle, snap,
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
  analyze: function(focusOn) {
    var entity, i, inventory, k, l, layer, len, len1, name, ref;
    if (focusOn == null) {
      focusOn = -1;
    }
    inventory = {};
    ref = this.entities;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      layer = ref[i];
      if ((focusOn === i) || focusOn === -1) {
        for (l = 0, len1 = layer.length; l < len1; l++) {
          entity = layer[l];
          name = entity.constructor.name;
          if (inventory[name] == null) {
            inventory[name] = 0;
          }
          inventory[name]++;
        }
      }
    }
    return console.log(inventory);
  },
  getAllInstancesOf: function(name, focusOn) {
    var entity, i, instanceName, instances, k, l, layer, len, len1, ref;
    if (focusOn == null) {
      focusOn = -1;
    }
    instances = [];
    ref = this.entities;
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      layer = ref[i];
      if ((focusOn === i) || focusOn === -1) {
        for (l = 0, len1 = layer.length; l < len1; l++) {
          entity = layer[l];
          instanceName = entity.constructor.name;
          if (instanceName === name) {
            instances.push(entity);
          }
        }
      }
    }
    return instances;
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

  function Entity(layer) {
    if (layer == null) {
      layer = 0;
    }
    this._layer = layer;
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

Color = (function(superClass) {
  extend(Color, superClass);

  Color.prototype.r = 255;

  Color.prototype.g = 255;

  Color.prototype.b = 255;

  Color.prototype.a = 1;

  function Color(color) {
    if (color == null) {
      color = '#fff';
    }
    Color.__super__.constructor.call(this);
    this.set(color);
  }

  Color.prototype.set = function(color) {
    var b, g, match, r;
    color = color.replace(/[ ]+/g, '').toLowerCase();
    if ((color.length === 7) && color.match(/#[0-9a-f]{6}/)) {
      this.r = parseInt(color.substring(1, 3), 16);
      this.g = parseInt(color.substring(3, 5), 16);
      this.b = parseInt(color.substring(5, 7), 16);
      return this.a = 1;
    } else if ((color.length === 4) && color.match(/#[0-9a-f]{3}/)) {
      r = parseInt(color.substring(1, 2), 16);
      g = parseInt(color.substring(2, 3), 16);
      b = parseInt(color.substring(3, 4), 16);
      this.r = (r * 16) + r;
      this.g = (g * 16) + g;
      this.b = (b * 16) + b;
      return this.a = 1;
    } else if (match = color.match(/rgba\(([0-9]+),([0-9]+),([0-9]+),([\.0-9]+)\)/)) {
      this.r = parseInt(match[1]);
      this.g = parseInt(match[2]);
      this.b = parseInt(match[3]);
      return this.a = parseFloat(match[4]);
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

  Color.prototype.setReference = function(reference) {
    this.reference = reference;
  };

  Color.prototype.toString = function() {
    return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
  };

  return Color;

})(Entity);

Pane = (function(superClass) {
  extend(Pane, superClass);

  function Pane(_layer) {
    this._layer = _layer != null ? _layer : 1;
    Pane.__super__.constructor.call(this, this._layer);
    this.position = {
      absolute: new Point(0, 0),
      relative: new Point(0, 0)
    };
    this.size = {
      width: 0,
      height: 0,
      surface: 0,
      circumference: 0
    };
    this.color = new Color();
    this.reference = WINDOW;
    this.children = [];
    this.particles = [];
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
    this.hasBoundingBox = false;
    this.boundingBox = null;
    this.hasChanged = false;
  }

  Pane.prototype.setPosition = function(x, y) {
    x = parseFloat(x);
    if (x === NaN) {
      console.warn("Pane.setPosition()", x, "is not a valid value for x");
    } else {
      this.position.relative.x = x;
    }
    y = parseFloat(y);
    if (y === NaN) {
      console.warn("Pane.setPosition()", y, "is not a valid value for y");
    } else {
      this.position.relative.y = y;
    }
  };

  Pane.prototype.setAbsolutePosition = function(x, y) {
    return this.position.absolute = {
      x: x,
      y: y
    };
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
    if (this.color) {
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
      this.color.setOpacity(opacity);
      this.updateParticles('setColor', this.color);
    }
  };

  Pane.prototype.setReference = function(reference, _childID) {
    this.reference = reference;
    this._childID = _childID;
  };

  Pane.prototype.setColor = function(color, opacity) {
    if (opacity == null) {
      opacity = null;
    }
    if (typeof color === 'object') {
      this.color = color;
    } else {
      this.color.set(color);
    }
    if (opacity != null) {
      this.color.setOpacity(opacity);
    }
    this.color.setReference(this);
    return this.updateParticles('setColor', this.color);
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

  Pane.prototype.getCenter = function() {
    this.center = {
      x: (this.size.width - 1) / 2,
      y: (this.size.height - 1) / 2
    };
    return this.center;
  };

  Pane.prototype.getColor = function() {
    return this.color;
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
    child.setReference(this, this.children.length + this.particles.length - 1);
  };

  Pane.prototype.addParticle = function(particle) {
    this.particles.push(particle);
    particle.setReference(this, this.particles.length + this.children.length - 1);
    particle.isVisible = this.isVisible;
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
    if (this.particles[i]) {
      return this.particles[i];
    } else {
      particle = new Particle(this._layer);
      this.addParticle(particle);
      return particle;
    }
  };

  Pane.prototype.enableBoundingBox = function(color) {
    if (color == null) {
      color = '#fff';
    }
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

  Particle.prototype.color = null;

  Particle.prototype.size = {
    width: 1,
    height: 1
  };

  Particle.prototype.reference = WINDOW;

  Particle.prototype.isVisible = true;

  Particle.prototype.hasChanged = false;

  function Particle(_layer) {
    this._layer = _layer != null ? _layer : 1;
    Particle.__super__.constructor.call(this, this._layer);
    this.position = {
      relative: new Point(0, 0),
      absolute: {
        x: 0,
        y: 0
      }
    };
  }

  Particle.prototype.setReference = function(reference, _particleID) {
    this.reference = reference;
    this._particleID = _particleID;
    return this.color = this.reference.getColor();
  };

  Particle.prototype.setPosition = function(x, y) {
    x = parseFloat(x);
    if (x === NaN) {
      console.warn("Particle.setPosition()", x, "is not a valid value for x");
    } else {
      this.position.relative.x = x;
    }
    y = parseFloat(y);
    if (y === NaN) {
      console.warn("Particle.setPosition()", y, "is not a valid value for y");
    } else {
      this.position.relative.y = y;
    }
    return this.hasChanged = true;
  };

  Particle.prototype.setSize = function(width, height) {
    this.size = {
      width: width,
      height: height
    };
    return this.hasChanged = true;
  };

  Particle.prototype.setOpacity = function(opacity) {
    if (this.color != null) {
      this.color.setOpacity(opacity);
    }
  };

  Particle.prototype.setColor = function(color, opacity) {
    if (opacity == null) {
      opacity = null;
    }
    if (typeof color === 'object') {
      this.color = color;
    } else {
      this.color.set(color);
    }
    if (opacity != null) {
      this.setOpacity(opacity);
    }
  };

  Particle.prototype.update = function() {
    var x, y;
    if (this.hasChanged) {
      x = this.reference.getX() + this.position.relative.x;
      y = this.reference.getY() + this.position.relative.y;
      if ((x !== NaN) && (y !== NaN)) {
        this.position.absolute.x = x;
        this.position.absolute.y = y;
      } else {
        console.warn("Particle.update()", x + "," + y, "is not a valid position");
      }
      this.hasChanged = false;
    }
  };

  Particle.prototype.draw = function() {
    var height, left, top, width;
    if (this.isVisible && (this.color.a > 0)) {
      left = snap(this.position.absolute.x * PX);
      top = snap(this.position.absolute.y * PX);
      width = snap(this.size.width * PX);
      height = snap(this.size.height * PX);
      CONTEXT.fillStyle = this.color;
      CONTEXT.fillRect(left, top, width, height);
    }
  };

  Particle.prototype.show = function() {
    this.isVisible = true;
    return this;
  };

  Particle.prototype.hide = function() {
    this.isVisible = false;
    return this;
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

  Particle.prototype.getX = function() {
    return this.position.relative.x;
  };

  Particle.prototype.getY = function() {
    return this.position.relative.y;
  };

  return Particle;

})(Entity);

Point = (function(superClass) {
  extend(Point, superClass);

  Point.prototype.x = null;

  Point.prototype.y = null;

  function Point(x, y) {
    if (x == null) {
      x = 0;
    }
    if (y == null) {
      y = 0;
    }
    if (x === NaN || y === NaN) {
      console.log("Point()", x + "," + y, "is not a valid Point");
      return false;
    } else {
      this.x = x;
      this.y = y;
    }
    Point.__super__.constructor.call(this, 0);
  }

  Point.prototype.moveTo = function(x, y, duration, easing) {
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
      from: this.x,
      to: x
    });
    parameters.push({
      name: 'y',
      from: this.y,
      to: y
    });
    this.tween = new Tween(parameters, duration, easing);
    return this.setState('tween', 'idle');
  };

  Point.prototype.update = function() {
    switch (this.state) {
      case 'tween':
        this.x = Math.round(this.tween.getValue('x'));
        this.y = Math.round(this.tween.getValue('y'));
        if (this.tween.isComplete) {
          this.setState(this.nextState);
        }
    }
  };

  return Point;

})(Entity);

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

  BoundingBox.prototype.extension = 2;

  BoundingBox.prototype.padding = 1;

  function BoundingBox() {
    BoundingBox.__super__.constructor.call(this, 1);
  }

  BoundingBox.prototype.setColor = function(color) {
    if (typeof color === 'object') {
      return this.color = color;
    } else {
      return this.color = new Color(color);
    }
  };

  BoundingBox.prototype.update = function() {
    if (this.reference.constructor.name === 'Line') {
      this.left = this.reference.position.absolute.x * PX;
      this.top = this.reference.position.absolute.y * PX;
    } else {
      this.left = this.reference.getX() * PX;
      this.top = this.reference.getY() * PX;
    }
    this.width = this.reference.getWidth() * PX;
    return this.height = this.reference.getHeight() * PX;
  };

  BoundingBox.prototype.draw = function() {
    var extension, height, left, padding, top, width;
    padding = this.padding * PX;
    extension = this.extension * PX;
    CONTEXT.fillStyle = this.color;
    top = this.top - 1 - padding;
    left = this.left - 1 - padding - extension;
    width = this.width + 2 + (padding * 2) + (extension * 2);
    CONTEXT.fillRect(left, top, width, 1);
    top = top + 1 + this.height + (padding * 2);
    CONTEXT.fillRect(left, top, width, 1);
    top = this.top - 1 - padding - extension;
    left = this.left - 1 - padding;
    height = this.height + 2 + (padding * 2) + (extension * 2);
    CONTEXT.fillRect(left, top, 1, height);
    left = left + 1 + this.width + (padding * 2);
    CONTEXT.fillRect(left, top, 1, height);
  };

  return BoundingBox;

})(Pane);

Circle = (function(superClass) {
  extend(Circle, superClass);

  Circle.prototype.diameter = null;

  Circle.prototype.radius = null;

  Circle.prototype.center = new Point(0, 0);

  Circle.prototype.type = 'stretch';

  function Circle(_layer) {
    this._layer = _layer != null ? _layer : 1;
    Circle.__super__.constructor.call(this, this._layer);
    this.hasOutline = false;
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

  Circle.prototype.setSize = function(diameter) {
    this.diameter = diameter;
    Circle.__super__.setSize.call(this, this.diameter, this.diameter);
    this.updateDimensions();
  };

  Circle.prototype.updateDimensions = function() {
    if (this.diameter) {
      this.radius = this.diameter / 2;
      this.center.x = (this.getWidth() - 1) / 2;
      this.center.y = (this.getHeight() - 1) / 2;
      return this.hasChanged = true;
    }
  };

  Circle.prototype.getMinY = function() {
    var angle, k, l, minY, radians, ref, x, y;
    minY = [];
    for (x = k = 0, ref = this.diameter - 1; 0 <= ref ? k <= ref : k >= ref; x = 0 <= ref ? ++k : --k) {
      minY.push(this.diameter);
    }
    for (angle = l = 0; l <= 179; angle = ++l) {
      radians = angle * (Math.PI / 180);
      x = Math.round(this.center.x + (Math.cos(radians) * this.radius));
      y = Math.round(this.center.y - (Math.sin(radians) * this.radius));
      if (y < minY[x]) {
        minY[x] = y;
      }
    }
    return minY;
  };

  Circle.prototype.update = function() {
    var _x, _y, diffX, diffY, distanceFromCenter, fromY, height, i, k, l, len, len1, len2, m, minY, n, o, p, particle, position, positions, ref, ref1, ref2, ref3, toY, x, y;
    if (this.hasChanged) {
      if (this.center && this.radius) {
        i = 0;
        if (this.type === 'fill') {
          for (x = k = 0, ref = this.diameter; 0 <= ref ? k <= ref : k >= ref; x = 0 <= ref ? ++k : --k) {
            for (y = l = 0, ref1 = this.diameter; 0 <= ref1 ? l <= ref1 : l >= ref1; y = 0 <= ref1 ? ++l : --l) {
              diffX = this.center.x - x;
              diffY = this.center.y - y;
              distanceFromCenter = Math.sqrt((diffX * diffX) + (diffY * diffY));
              if (distanceFromCenter < this.radius) {
                particle = this.getParticle(i);
                particle.setPosition(x, y);
                particle.show();
                i++;
              }
            }
          }
        } else if (this.type === 'stretch') {
          minY = this.getMinY();
          for (x = m = 0, len = minY.length; m < len; x = ++m) {
            y = minY[x];
            height = this.diameter - (y * 2);
            particle = this.getParticle(i);
            particle.setPosition(x, y);
            particle.setSize(1, height);
            particle.show();
            i++;
          }
        }
        if (this.hasOutline) {
          minY = this.getMinY();
          fromY = Math.round(this.radius - 1);
          for (x = n = 0, len1 = minY.length; n < len1; x = ++n) {
            toY = minY[x];
            if (x < this.radius) {
              if (fromY < toY) {
                fromY = toY;
              }
              for (y = o = ref2 = fromY, ref3 = toY; ref2 <= ref3 ? o <= ref3 : o >= ref3; y = ref2 <= ref3 ? ++o : --o) {
                _x = (this.diameter - 1) - x;
                _y = (this.diameter - 1) - y;
                positions = [];
                positions.push({
                  x: x,
                  y: y
                });
                if (_x >= this.radius) {
                  positions.push({
                    x: _x,
                    y: y
                  });
                }
                if (_y >= this.radius) {
                  positions.push({
                    x: x,
                    y: _y
                  });
                }
                if (_x >= this.radius && _y >= this.radius) {
                  positions.push({
                    x: _x,
                    y: _y
                  });
                }
                for (p = 0, len2 = positions.length; p < len2; p++) {
                  position = positions[p];
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
        return this.hasChanged = false;
      }
    }
  };

  return Circle;

})(Pane);

Font = (function() {
  function Font(name) {
    this.name = "FONT_" + name;
    if (window[this.name]) {
      this.loadFont();
    } else {
      console.error("Font(): '" + this.name + "' doesn't exist");
    }
  }

  Font.prototype.loadFont = function() {
    return this.data = window[this.name];
  };

  Font.prototype.getGlyph = function(glyph) {
    var data;
    if (this.data.glyphs[glyph] != null) {
      data = this.isValid(this.data.glyphs[glyph]);
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

  Font.prototype.isValid = function(data) {
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

  Line.prototype._from = null;

  Line.prototype._to = null;

  Line.prototype._angle = null;

  Line.prototype.length = 0;

  Line.prototype.offset = 0;

  Line.prototype.weight = 1;

  function Line(_layer) {
    this._layer = _layer != null ? _layer : 1;
    Line.__super__.constructor.call(this, this._layer);
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

  Line.prototype.setWeight = function(weight) {
    this.weight = weight;
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
      this.diffX = this._to.x - this._from.x;
      this.diffY = this._to.y - this._from.y;
      this.width = Math.abs(this.diffX);
      this.height = Math.abs(this.diffY);
      this.length = Math.sqrt((this.width * this.width) + (this.height * this.height));
      x = Math.min(this._to.x, this._from.x);
      y = Math.min(this._to.y, this._from.y);
      this.setAbsolutePosition(this.getX() + x, this.getY() + y);
      this.setSize(this.width, this.height);
    }
  };

  Line.prototype.update = function() {
    var i, increment, j, k, l, m, n, particle, ref, ref1, ref2, ref3, ref4, ref5, ref6, results, x, y;
    i = 0;
    this.calculateDimensions();
    if (Math.abs(this.diffX) >= Math.abs(this.diffY)) {
      y = this._from.y;
      increment = this.diffY / Math.abs(this.diffX);
      for (x = k = ref = this._from.x, ref1 = this._to.x; ref <= ref1 ? k <= ref1 : k >= ref1; x = ref <= ref1 ? ++k : --k) {
        particle = this.getParticle(i);
        particle.setPosition(x, y);
        particle.show();
        y += increment;
        i++;
      }
    } else {
      x = this._from.x;
      increment = this.diffX / Math.abs(this.diffY);
      for (y = l = ref2 = this._from.y, ref3 = this._to.y; ref2 <= ref3 ? l <= ref3 : l >= ref3; y = ref2 <= ref3 ? ++l : --l) {
        particle = this.getParticle(i);
        particle.setPosition(x, y);
        particle.show();
        x += increment;
        i++;
      }
    }
    if (this.offset) {
      for (j = m = 0, ref4 = Math.round(i * this.offset); 0 <= ref4 ? m <= ref4 : m >= ref4; j = 0 <= ref4 ? ++m : --m) {
        this.getParticle(j).hide();
      }
    }
    if ((this.particles.length - 1) > i) {
      results = [];
      for (j = n = ref5 = i, ref6 = this.particles.length - 1; ref5 <= ref6 ? n <= ref6 : n >= ref6; j = ref5 <= ref6 ? ++n : --n) {
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

  Path.prototype.points = [];

  Path.prototype.lines = [];

  Path.prototype.addPoint = function(point) {
    point = isPoint(point);
    if (point) {
      this.points.push(point);
      if (this.points.length > 1) {
        this.addLine();
      }
      return true;
    } else {
      console.warn("Path.addPoint()", point, "is not valid");
      return false;
    }
  };

  Path.prototype.addLine = function() {
    var line;
    this.a = this.points[this.points.length - 2];
    this.b = this.points[this.points.length - 1];
    line = new Line();
    line.from(this.a).to(this.b);
    this.lines.push(line);
    this.addChild(line);
  };

  return Path;

})(Pane);

Rectangle = (function(superClass) {
  extend(Rectangle, superClass);

  function Rectangle() {
    return Rectangle.__super__.constructor.apply(this, arguments);
  }

  Rectangle.prototype.type = 'stretch';

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

  Rectangle.prototype.update = function() {
    var i, j, k, l, len, len1, m, n, o, p, particle, q, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, results, results1, s, x, y;
    if (this.type === 'stretch') {
      particle = this.getParticle(0).show();
      particle.setPosition(this.position.absolute.x, this.position.absolute.y);
      particle.setSize(this.size.width, this.size.height);
      i = 1;
      if (this.hasOutline) {
        particle = this.getParticle(i);
        particle.setPosition(0, 0);
        particle.setSize(this.size.width, 1);
        particle.setColor(this.outlineColor);
        i++;
        particle = this.getParticle(i);
        particle.setPosition(0, this.size.height - 1);
        particle.setSize(this.size.width, 1);
        particle.setColor(this.outlineColor);
        i++;
        particle = this.getParticle(i);
        particle.setPosition(0, 1);
        particle.setSize(1, this.size.height - 2);
        particle.setColor(this.outlineColor);
        i++;
        particle = this.getParticle(i);
        particle.setPosition(this.size.width - 1, 1);
        particle.setSize(1, this.size.height - 2);
        particle.setColor(this.outlineColor);
        i++;
      }
      if ((this.particles.length - 1) > i) {
        results = [];
        for (j = k = ref = i, ref1 = this.particles.length - 1; ref <= ref1 ? k <= ref1 : k >= ref1; j = ref <= ref1 ? ++k : --k) {
          results.push(this.getParticle(j).hide());
        }
        return results;
      }
    } else if (this.type === 'fill') {
      i = 0;
      for (x = l = 0, ref2 = this.size.width - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; x = 0 <= ref2 ? ++l : --l) {
        for (y = m = 0, ref3 = this.size.height - 1; 0 <= ref3 ? m <= ref3 : m >= ref3; y = 0 <= ref3 ? ++m : --m) {
          particle = this.getParticle(i);
          particle.setPosition(x, y);
          particle.show();
          i++;
        }
      }
      if (this.hasOutline) {
        for (x = n = 0, ref4 = this.size.width - 1; 0 <= ref4 ? n <= ref4 : n >= ref4; x = 0 <= ref4 ? ++n : --n) {
          ref5 = [0, this.size.height - 1];
          for (o = 0, len = ref5.length; o < len; o++) {
            y = ref5[o];
            particle = this.getParticle(i);
            particle.setPosition(x, y);
            particle.setColor(this.outlineColor);
            particle.show();
            i++;
          }
        }
        for (y = p = 1, ref6 = this.size.height - 2; 1 <= ref6 ? p <= ref6 : p >= ref6; y = 1 <= ref6 ? ++p : --p) {
          ref7 = [0, this.size.width - 1];
          for (q = 0, len1 = ref7.length; q < len1; q++) {
            x = ref7[q];
            particle = this.getParticle(i);
            particle.setPosition(x, y);
            particle.setColor(this.outlineColor);
            particle.show();
            i++;
          }
        }
      }
      if ((this.particles.length - 1) > i) {
        results1 = [];
        for (j = s = ref8 = i, ref9 = this.particles.length - 1; ref8 <= ref9 ? s <= ref9 : s >= ref9; j = ref8 <= ref9 ? ++s : --s) {
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
    var i, k, particle, ref, results, value, x, y;
    this.data = data1;
    if (this.parseData()) {
      results = [];
      for (i = k = 0, ref = this.data.particles.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
        value = this.data.particles.charAt(i);
        x = i % this.data.width;
        y = Math.floor(i / this.data.width);
        if (value !== '0') {
          particle = new Particle();
          this.addParticle(particle);
          particle.setColor(this.data.colors[value]);
          results.push(particle.setPosition(x, y));
        } else {
          results.push(void 0);
        }
      }
      return results;
    } else {
      return console.error("Sprite.load(): Can't load Sprite, data is not valid", this.data);
    }
  };

  Sprite.prototype.parseData = function() {
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

  return Sprite;

})(Pane);

Square = (function(superClass) {
  extend(Square, superClass);

  function Square() {
    return Square.__super__.constructor.apply(this, arguments);
  }

  Square.prototype.setSize = function(size) {
    Square.__super__.setSize.call(this, size, size);
  };

  return Square;

})(Rectangle);

Text = (function(superClass) {
  extend(Text, superClass);

  function Text() {
    return Text.__super__.constructor.apply(this, arguments);
  }

  Text.prototype.setFont = function(font) {
    this.font = font;
  };

  Text.prototype.setText = function(text) {
    this.text = text;
    return this.drawGlyphs();
  };

  Text.prototype.setColor = function(color1) {
    this.color = color1;
  };

  Text.prototype.drawGlyphs = function() {
    var data, glyph, i, k, ref, value, x, y;
    x = 0;
    y = 0;
    for (i = k = 0, ref = this.text.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
      value = this.text.charAt(i);
      data = this.font.getGlyph(value);
      if (data) {
        data.colors = {
          1: this.color
        };
        glyph = new Sprite();
        this.addChild(glyph);
        glyph.load(data);
        glyph.setPosition(x, y);
        x += glyph.getWidth() + 1;
      }
    }
    return this.setSize(x - 1, this.font.getHeight());
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
