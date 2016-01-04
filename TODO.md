# Plan de campagne

This document is used in favor of Github issues until a first public release

## Short term focus

- [ ] Add keyboard, mouse and touch events
- [ ] Think of more practical examples to showcase the tools and allow for visual regression testing
  - [ ] Spaceship dashboard thing: recreate the old Windows screensaver where you appear to be travelling across the stars. On top of that is a rotating radar, which 'beeps' when it touches a stars that is 'within range'. The range of a star is visualized by its opacity. Additionally, some bogus sensor stuff can be added to make it more awesome. Each star that is within reach is tagged with a Sprite and a random code or something.
- [ ] Can [Particle] be a child of [Point] to avoid all the extra entities created?

---

## API

### Animation

### BoundingBox

### Button

- is a property of a [Pane] and as such registers itself to listen to click/touch events on WINDOW.

### Circle

- [ ] Implement as child of [Oval]
- [ ] Set weight of outline (possibly using a [CompoundPane])
- [ ] `update()`: `hasChanged` should also check if its reference has changed
- [ ] `outline()`: draw partial outline
- [ ] `stretch()` and `fill()` don't result in the same circle. At first glance (because `outline()` uses the same method), `fill()` is more accurate, though also highly more cpu intensive. `stretch()` looks as if it rounds up, while `fill()` regularly rounds coordinates.
  - [ ] See [example-05]; the inner, smallest circle is definitely not a circle, and the spokes don't line up consistenly with the other circles

### Color

- [ ] Implement possibility for gradients
- [ ] `change()`, initiates a color transition tween
- [ ] The `opacity` of an [Entity] should be separate from the opacity of the [Color]. The base color for a particle (and as such, a base opacity) are shared, but the private `opacity` of an instance remains private. Ergo, `Entity.setOpacity()` does something else than `Color.setOpacity()`.

### Controller

- [ ] Deprecate the concept of a [Controller] in favor of just extending an [Entity]?

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
- [ ] Draw each layer of entities on a separate <canvas> element; see [Pane] for a possibly better implementation
- [ ] Add a `numberOfEntities` property, and throw a warning when this amount exceeds a certain limit. Throw consecutive warnings on certain increments.
- [ ] Add a `window.DT` for timing related stuff that doesn't use a [Timer]
- [ ] BUG: When removing an [Entity], other entities such as [Points] and [Colors] stay behind, because they are not automatically cleaned up. Cleaning up these leftovers can be implemented manually in an instance's `remove()` before calling `super()`, but entities that are shared pose an issue. A possible solution would be for entities to know their parents, and to self-destruct when they become orphans. However, this poses the issue that some Entities are deliberately parentless.

### Entity

### Font

- [FONT_9PX]
  - [ ] `r` feels too small
  - [ ] `z` feels to big/heavy in context
  - [ ] `+` is too small
  - [ ] `N` could use semi-transparency
  - [ ] `&` is too complex
  - [ ] `€` and `£`, and perhaps other latin extended glyphs?
- [ ] Create default font at `11px` (basically 9px with an added px at the top and bottom)
- [ ] Create an uppercase only font at `5px`; glyphs are converted to uppercase behind the scenes
- [ ] Possibly create a 5x7 fixed width default font
- [ ] Allow a `fallback`
  - [ ] Test with extending a default font (with a é for instance)
  - [ ] Test with replacing a glyph in a default font
- [ ] Allow opacities to be defined similar to colors in regular [Sprites]

### Hitbox

- Is a property of a [Pane]

### Line

- [ ] Allow `to()` and `from()` to accept two numbers instead of [Points]; values are converted to a [Point] behind the scenes
- [ ] Add relative positioning (relative to `@_from`)
- [ ] `setColor()`
- [ ] BUG: occassionally, particles stay in their old positions
- [ ] Allow a start and a stop offset

### Pane

- [ ] `setCSSProperty()`: allow percentages (or floats) as values. Will need an update of `onResize()` as well.
- [ ] `setOverflow()`: defaults to 'visible'
- [ ] `setColor()` does not work when called before the `addChild()` is executed on that [Pane]
- [ ] Calculate overlap between this [Pane] and another, optionally on the level of its children
- [ ] Rename `addChild()` to `add()`; the concept of children is technical, and not necessary on the front-end
- [ ] FUTURE PLAN: Create a separate canvas/context for every [Pane] that is created with when a `_layer` is specified. All children and particles added to that instance will be drawn on its private context. This will inherently mean that any overflow is hidden.
- [ ] Shared method to clean up unused `particles`
- [ ] Remove the default [Color] that's created, and possibly replace with a reference to a default color set on [Engine] (foreground vs background)

### Particle

- [ ] Optionally display [Particles] as separate rectangles (with a 1px margin)

### Path

- [ ] `setColor()`
- [ ] `close()`; attaches last to first points
- [ ] `fill()`

### Point

### Polygon

- a collection of [Points], grouped in [Triangles], to draw more complex shapes

### Rectangle

### Shape

- A collection of [Panes], each of which is either added or removed. The particles on each [Pane] are initially interpreted as simple black/white additions/subtractions.

### Sprite

- [ ] `rotate()`: in increments of 90 degrees
- [ ] Allow whitespace to be added to `particles` which is removed upon loading

### SpriteSet

- a group of [Sprites] with methods to control which one is visible

### Square

### Storage

### Text

- [ ] Allow multi-line texts. Text will have to be separated into [Words]

### Timer

### Triangle

- a collection of three [Points] whose surface is filled with [Particles] (or possibly an outline)

### Tween

---

## Documentation

- How the [Engine] works (`update()`, `draw()` and layers)
- The difference between children and particles
- The concept of references and hierarchial inheritence
- Setting up a new project

---

## Various bugs, ideas and todos

- [ ] Come up with a way to implement an automated testing suite _at all_. It is possible to base it on a standalone version of [Jasmine] that is able to visually check the test canvas.
- [ ] Implement `hasChanged` consistently across [Panes]; in the future, when multiple canvasses are implemented, a canvas only has to be redrawn when something has changed in its scope
- [ ] Blending modes on a drawing layer
- [ ] `Pane.setColor()` and `Particle.setColor()` do the same thing (including the various places these methods are invoked)
- [ ] Uglify the combined Javascript in [/dist]
- [ ] Generate a standalone version with a blank template for a project

### References

- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
