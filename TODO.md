# Plan de campagne

---

## Priorities

- Drawing [Rectangles] and [Squares]
- Separate `color` and `opacity`
- Convert all coordinates to [Points]

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

### Rectangle (and Square) _(extends Pane)_

- [ ] `fill()`
- [ ] `stretch()`
- [ ] `outline()`

### Sprite _(extends Pane)_

- contains [Particles] (from a data source) that resemble an image
- [ ] `rotate()`: in increments of 90 degrees

### SpriteSet _(extends Controller)_

- a group of [Sprites] with methods to control which one is visible

### Storage

### Text _(extends Pane)_

- text is rendered as [Letters] and contained within a [Pane]

### Timer _(extends Entity)_

### Triangle _(extends Pane)_

- a collection of three [Points] whose surface is filled with [Particles] (or possibly an outline)

### Tween _(extends Timer)_

---

## Documentation

- Animation
- BoundingBox
- Button
- Circle
- Controller
- Engine
- Entity
- Letter
- Line
- Pane
- Particle
- Path
- Point
- Polygon
- Rectangle
- Sprite
- SpriteSet
- Storage
- Text
- Timer
- Triangle
- Tween

---

## Automated testing

- [ ] Come up with a way to implement an automated testing suite _at all_. It is possible to base it on a standalone version of [Jasmine] that is able to visually check the test canvas.
