# Plan de campagne

## Short term focus

- [ ] [example-04] has 11268 (!) entities on just the first layer, which is quite unaccountable for, possibly an overkill of [Points]. The second layer has 3000+ entities because of the pixels the circle is made out of.
- [ ] [BoundingBox] on a [Line]
- [ ] Separate `color` and `opacity`
- [ ] Update [README.md] and think of more practical examples
- [ ] Implement `fill()`, `outline()` and `stretch()` for [Circle] and [Rectangle]
- [ ] Implement `hasChanged` consistently accross [Panes]
- [ ] Text
- [ ] See: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas

---

## API

### Animation _extends_ SpriteSet

### BoundingBox

- [ ] Does this work on a [Line]?

### Button

- is a property of a [Pane] and as such registers itself to listen to click/touch events on WINDOW.

### Circle _extends_ Pane

- [ ] Implement as child of [Oval]
- [ ] `fill()`
- [ ] `stretch()`: similar to `fill()` but the circle is composed of vertically stretched pixels. Best option to be used when not part of a [Shape] as it reduces the amount of [Particles] needed by well over 90%.
- [ ] `outline()`
  - [ ] Remove duplicate particles; or calculate the amount of detail needed to draw an acceptable circle (ie, not necessarily all 360 degrees); or draw a quarter of the circle, and duplicate the other three quarters
  - [ ] Remove unneccessary particles (for a 1px outline)
  - [ ] Set thickness of outline (possibly using a [CompoundPane])
- [ ] `update()`: `hasChanged` should also check if its reference has changed

### Color

- [ ] Implement possibility for gradients
- [ ] `change()`, initiates a color transition tween

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
- [ ] `getAllInstancesOf(class, layer)`: returns all instances of `class`; `layer` is optional
- [ ] Draw each layer of entities on a separate <canvas> element

### Entity

### Letter _extends_ Sprite

- [ ] Create default typefaces at 9px, 11px and a uppercase only version at 5px.

### Line _extends_ Pane

- [ ] Allow `to()` and `from()` to accept arrays instead of [Points]; arrays are converted to a point internally
- [ ] Add relative positioning (of entire line)
- [ ] Add relative positioning (of `@_from`)
- [ ] `setColor()`
- [ ] `setOpacity()`
- [ ] Clean up children
- [ ] BUG: occassionally, particles stay in their old positions

### Pane _extends_ Entity

- [ ] `getOpacity()`
- [ ] `setCSSProperty()`: allow percentages (or floats) as values. Will need an update of `onResize()` as well.
- [ ] `setOverflow()`: defaults to 'visible'
- [ ] `setColor()` does not work when called before the `addChild()` is executed on that [Pane]
- [ ] `setOpacity()` should apply to a [Pane] as a whole, and not as a value to be multiplied for each separate particle. In this sense, `setOpacity()`'s main function is to allow a compound shape to be faded in or out.

### Particle _extends_ Entity

- [ ] Optionally display [Particles] as separate rectangles, with a 1px margin

### Path _extends_ Pane

- [ ] `setOpacity()`
- [ ] `setColor()`
- [ ] `close()`; attached first to last points
- [ ] `fill()`
- [ ] `setThickness()`

### Point _extends_ Entity

- [ ] Convert all coordinates to [Points]

### Polygon _extends_ Pane

- a collection of [Points], grouped in [Triangles], to draw more complex shapes

### Rectangle _extends_ Pane

- [ ] `fill()`
- [ ] `stretch()`
- [ ] `outline()`

### Shape

- A collection of [Panes], each of which is either added or removed. The particles on each [Pane] are initially interpreted as simple black/white additions/subtractions.

### Sprite _extends_ Pane

- contains [Particles] (from a data source) that resemble an image
- [ ] `rotate()`: in increments of 90 degrees

### SpriteSet _extends_ Controller

- a group of [Sprites] with methods to control which one is visible

### Square _extends_ Rectangle

### Storage

### Text _extends_ Pane

- text is rendered as [Letters] and contained within a [Pane]

### Timer _extends_ Entity

### Triangle _extends_ Pane

- a collection of three [Points] whose surface is filled with [Particles] (or possibly an outline)

### Tween _extends_ Timer

---

## Helper functions

### General helpers

- [ ] `addDiversity()`
- [ ] `average()`
- [ ] `delay()`
- [ ] `getRandomFromArray()`
- [ ] `getRandomFromObject()`
- [ ] `getRandomInt()`
- [ ] `getWeighedInt()`
- [ ] `shuffle()`
- [ ] `snap()`

### Engine specific helpers

- [ ] `isPoint()`

---

## Getting started

- How the [Engine] works (`update()`, `draw()` and layers)
- The concept of references and hierarchial inheritence
- Setting up a new project

## Documentation

- Animation
- (BoundingBox, not documented, for debugging only)
- Button
- [Circle]
  - [ ] `new Circle()`
  - [ ] `Circle.setCenter()`
  - [ ] `Circle.setRadius()`
- [Color]
  - [ ] `Color.set()`
  - [ ] `Color.setOpacity()`
  - [ ] `Color.change()`
- (Controller, might be deprecated)
- [Engine]
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
- [Entity]
  - [ ] `Entity.remove()`
  - [ ] `Entity.setState()`
- Letter
- [Line]
  - [ ] `Line.atAngle()`
  - [ ] `Line.from()`
  - [ ] `Line.setWeight()`
  - [ ] `Line.to()`
- [Pane]
  - [ ] `Pane.position`
  - [ ] `Pane.size`
  - [ ] `Pane.addChild()`
  - [ ] `Pane.disableBoundingBox()`
  - [ ] `Pane.enableBoundingBox()`
  - [ ] `Pane.getCenter()`
  - [ ] `Pane.getChild()`
  - [ ] `Pane.getColor()`
  - [ ] `Pane.getHeight()`
  - [ ] `Pane.getOpacity()`
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
- [Particle]
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
- [Path]
  - [ ] `Path.addPoint()`
- [Point]
  - [ ] `new Point()`
  - [ ] `Point.moveTo()`
- Polygon
- [Rectangle]
  - [ ] `new Rectangle()`
- Sprite
- SpriteSet
- [Square]
  - [ ] `new Square()`
- [Storage]
  - [ ] types of storage available
  - [ ] `new Storage()`
  - [ ] `Storage.get()`
  - [ ] `Storage.isAvailable()`
  - [ ] `Storage.set()`
- Text
- [Timer]
  - [ ] `new Timer()`
- Triangle
- [Tween]
  - [ ] `new Tween()`
  - [ ] `Tween.getValue()`

---

## Automated testing

- [ ] Come up with a way to implement an automated testing suite _at all_. It is possible to base it on a standalone version of [Jasmine] that is able to visually check the test canvas.
