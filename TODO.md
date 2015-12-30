# Plan de campagne

---

## Priorities

- Drawing [Rectangles] and [Squares]
- Separate `color` and `opacity`, and combine with the parental `opacity`
- Convert all coordinates (internally) to [Points], and accept arrays as coordinates

---

## API

### Animation _(extends SpriteSet)_

### BoundingBox

### Button

- extends [Pane], or is a property of a [Pane]
- registers as a listener for click/touch events

### Circle _(extends Pane)_

- [ ] Implement as child of [Oval]
- [ ] `fill()`
- [ ] `outline()`
  - [ ] Remove duplicate particles
  - [ ] Remove unneccessary particles (for a 1px outline)
  - [ ] Set thickness of outline

### Color

- [ ] Implement possibility for gradients

### CompoundPane

- A collection of shapes, to are either added or removed, to create complex shapes

### Controller

### Engine

- [ ] Set configuration when initializing
  - [ ] Resizing and windowing
    - [ ] `extend`: (default = false) if only a width or height is specified, extend allows that value to be increased to fill the window as optimal as possible
    - [ ] `maxPX`: (default = false) if set, the value of PX will be limited
  - [ ] Color channel limitations
  - [ ] Show grid
  - [ ] Optional browser window padding
  - [ ] Full screen
- [ ] `pause()`
- [ ] Keyboard and mouse input (via a separate [Controller])
- [ ] Allow multiple canvases/contexts, and in extension, allow a canvas to be linked to an existing DOM-element.

### Entity

### Letter _(extends Sprite)_

- [ ] Create default typefaces at 9px, 11px and a uppercase only version at 5px.

### Line _(extends Pane)_

- [ ] Allow `to()` and `from()` to accept arrays instead of [Points]; arrays are converted to a point internally
- [ ] Add relative positioning (of entire line)
- [ ] Add relative positioning (of `@_from`)
- [ ] `setColor()`
- [ ] `setOpacity()`
- [ ] Clean up children

### Pane _(extends Entity)_

- [ ] `getOpacity()`
- [ ] `setCSSProperty()`: allow percentages (or floats) as values. Will need an update of `onResize()` as well.
- [ ] `setOverflow()`: defaults to 'visible'
- [ ] Mask (think of it as a combination of several shapes)
  - [ ] `add()`
  - [ ] `remove()`
- [ ] Move `getParticle()` from [Line], [Circle], [Rectangle] etc. to [Pane]

### Particle _(extends Entity)_

### Path _(extends Pane)_

- [ ] `setOpacity()`
- [ ] `setColor()`
- [ ] `close()`; attached first to last points
- [ ] `fill()`
- [ ] `setThickness()`

### Point _(extends Entity)_

- [ ] Convert all coordinates to [Points]

### Polygon _(extends Pane)_

- a collection of [Points], grouped in [Triangles], to draw more complex shapes

### Rectangle _(extends Pane)_

- [ ] `fill()`
- [ ] `stretch()`
- [ ] `outline()`

### Sprite _(extends Pane)_

- contains [Particles] (from a data source) that resemble an image
- [ ] `rotate()`: in increments of 90 degrees

### SpriteSet _(extends Controller)_

- a group of [Sprites] with methods to control which one is visible

### Square _(extends Rectangle)_

### Storage

### Text _(extends Pane)_

- text is rendered as [Letters] and contained within a [Pane]

### Timer _(extends Entity)_

### Triangle _(extends Pane)_

- a collection of three [Points] whose surface is filled with [Particles] (or possibly an outline)

### Tween _(extends Timer)_

---

## Helper functions

- [ ] `addDiversity()`
- [ ] `average()`
- [ ] `delay()`
- [ ] `getRandomFromArray()`
- [ ] `getRandomFromObject()`
- [ ] `getRandomInt()`
- [ ] `getWeighedInt()`
- [ ] `shuffle()`
- [ ] `snap()`

---

## Getting started

- How the [Engine] works (`update()` and `draw()`)
- The concept of references and hierarchial inheritence
- Setting up a new project

## Documentation

- Animation
- (BoundingBox)
- Button
- Circle
  - [ ] `new Circle()`
  - [ ] `Circle.setCenter()`
  - [ ] `Circle.setRadius()`
- Color
  - [ ] `Color.set()`
  - [ ] `Color.setOpacity()`
- (Controller)
- Engine
  - [ ] `window.PX`
  - [ ] `window.CONTEXT`
  - [ ] `window.WINDOW`
  - [ ] `window.NOW`
  - [ ] `window.DEBUG`
  - [ ] `Engine.isTouchDevice`
  - [ ] `Engine.init()`
  - [ ] `Engine.addEntity()`
  - [ ] `Engine.cleanUp()`
  - [ ] `Engine.removeEntity()`
  - [ ] `Engine.trigger()`
- Entity
  - [ ] `Entity.remove()`
  - [ ] `Entity.setState()`
- Letter
- Line
  - [ ] `Line.atAngle()`
  - [ ] `Line.from()`
  - [ ] `Line.to()`
- Pane
  - [ ] `Pane.position`
  - [ ] `Pane.size`
  - [ ] `Pane.addChild()`
  - [ ] `Pane.disableBoundingBox()`
  - [ ] `Pane.enableBoundingBox()`
  - [ ] `Pane.getCenter()`
  - [ ] `Pane.getHeight()`
  - [ ] `Pane.getWidth()`
  - [ ] `Pane.getX()`
  - [ ] `Pane.getY()`
  - [ ] `Pane.isWithinBounds()`
  - [ ] `Pane.setColor()`
  - [ ] `Pane.setCSS()`
  - [ ] `Pane.setCSSProperty()`
  - [ ] `Pane.setOpacity()`
  - [ ] `Pane.setPosition()`
  - [ ] `Pane.setSize()`
  - [ ] `Pane.updateChildren()`
- Particle
  - [ ] `Particle.position`
  - [ ] `Particle.size`
  - [ ] `Particle.getX()`
  - [ ] `Particle.getY()`
  - [ ] `Particle.hide()`
  - [ ] `Particle.isWithinBounds()`
  - [ ] `Particle.isWithinHorizontalBounds()`
  - [ ] `Particle.isWithinVerticalBounds()`
  - [ ] `Particle.setPosition()`
  - [ ] `Particle.show()`
  - [ ] `Particle.setColor()`
  - [ ] `Particle.setOpacity()`
  - [ ] `Particle.setPosition()`
  - [ ] `Particle.setSize()`
- Path
  - [ ] `Path.addPoint()`
- Point
  - [ ] `new Point()`
  - [ ] `Point.moveTo()`
- Polygon
- Rectangle
  - [ ] `new Rectangle()`
- Sprite
- SpriteSet
- Square
  - [ ] `new Square()`
- Storage
  - [ ] `new Storage()`
  - [ ] `Storage.get()`
  - [ ] `Storage.isAvailable()`
  - [ ] `Storage.set()`
- Text
- Timer
  - [ ] `new Timer()`
- Triangle
- Tween
  - [ ] `new Tween()`
  - [ ] `Tween.getValue()`

---

## Automated testing

- [ ] Come up with a way to implement an automated testing suite _at all_. It is possible to base it on a standalone version of [Jasmine] that is able to visually check the test canvas.
