# Plan de campagne

## Core

- `Controller`
- `Engine`
  - [ ] Set configuration when initializing
    - [ ] Resizing and windowing
      - [ ] `extend`: (default = false) if only a width or height is specified, extend allows that value to be increased to fill the window as optimal as possible
      - [ ] `maxPX`: (default = false) if set, the value of PX will be limited
    - [ ] Color channel limitations
    - [ ] Show grid
    - [ ] Optional browser window padding
    - [ ] Full screen
  - [ ] `Engine.pause()`
  - [ ] Keyboard and mouse input
- `Entity`
- `Pane`
  - [ ] Display debug bounding box, and optionally specify color
  - [ ] `Pane.getOpacity()`
  - [ ] `Pane.setCSSProperty()`: allow percentages (or floats) as values. Will need an update of `Pane.onResize()` as well.
  - [ ] `Pane.setOverflow()`: defaults to 'visible'
- `Particle`
- `Point`: a coordinate
- `Storage`
- `Timer`
- `Tween`

## Extended core

- `Animation` extends `SpriteSet`
- `BoundingBox`
- `Button` extends `Pane`: registers as a listener for click/touch events
- `Circle`: outline or filled
- `Letter` extends `Sprite`
- `Line`: the visual connection between two `Points`, distinction between absolute and relative coordinates
- `Path`: a list of connected `Points`, visualized as `Lines`
- `Polygon` extends `Line`: a collection of `Points` that are grouped in `Triangles` so that complex shapes can be drawn
- `Rectangle` extends `Pane`: either filled with `Particles` or a single stretched `Particle`
- `Sprite` extends `Pane`: contains particle data that resembles an image
  - [ ] `Sprite.rotate()`: in increments of 90 degrees
- `SpriteSet`: a group of `Sprites` with methods to control which one is visible
- `Text` extends `Pane`: text is rendered as `Letters` and contained within the `Pane`.
- `Triangle`: a collection of three `Points` whose surface is filled with `Particles`

## Automated testing

TODO
