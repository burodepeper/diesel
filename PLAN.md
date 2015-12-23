# Plan de campagne

## Core

- `Controller`
- `Engine`
  - [ ] Set configuration when initializing
    - [ ] Resizing and windowing
    - [ ] Color channel limitations
    - [ ] Pixel vs grid snapping
    - [ ] Show grid
    - [ ] Optional browser window padding
    - [ ] Full screen
  - [ ] `Engine.pause()`
- `Entity`
- `Pane`
  - [ ] Display debug bounding box, and optionally specify color
  - [ ] `Pane.getOpacity()`
  - [ ] `Pane.setCSSProperty()`: allow percentages (or floats) as values. Will need an update of `Pane.onResize()` as well.
- `Particle`
- `Storage`
- `Timer`
- `Tween`

## Extended core

- `Animation` extends `SpriteSet`
- `Button` extends `Pane`: registers as a listener for click/touch events
- `Letter` extends `Sprite`
- `Line`: a list of connected `Points`
- `Point`: a coordinate
- `Polygon` extends `Line`: a collection of `Points` that are grouped in `Triangles` so that complex shapes can be drawn
- `Rectangle` extends `Pane`: either filled with `Particles` or a single stretched `Particle`
- `Sprite` extends `Pane`: contains particle data that resembles an image
- `SpriteSet`: a group of `Sprites` with methods to control which one is visible
- `Text` extends `Pane`: text is rendered as `Letters` and contained within the `Pane`.
- `Triangle`: a collection of three `Points` whose surface is filled with `Particles`

## Automated testing

TODO
