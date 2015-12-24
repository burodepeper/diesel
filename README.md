# diesel-engine

**Work in progress...**

A sketchpad for interactive ideas; a Javascript based game-engine.

`diesel-engine` provides a set of barebones tools that allow you to easily create games. The particle based approach initially limits the emphasis on looks in favor of gameplay. However, don't let the retro look-and-feel fool you into thinking you can't create stunningly beautiful works of art with this engine.

---

## Examples

### 01) Bouncing particles

The canvas is divided in three columns, and each column is populated with 40 randomly bouncing particles.

- Viewport with fixed dimensions, adapts `PX` to size of browser
- Multiple variations of `Pane.setCSS()`
- Custom `BouncingParticle` that extends `Particle`

### 02) Bouncing particles within moving panes

Three square panes (with different sizes) are created and filled with bouncing particles. Each pane moves horizontally at a different speed.

- Horizontal movement of each `Pane` is controlled by a `Tween`
- Each `Pane` is controller by a custom `PaneController`
- For debugging purposes, each `Pane` has its `BoundingBox` enabled, which shows the unsnapped size and position of the `Pane` as an outline

### 03) Galaxy visualization (work in progress)

- Dynamically sized canvas (vertically fixed, max PX)
- Layers of particles moving in parallax to create a sense of depth

<!-- ### 04) Radar bleeps -->

---

## Documentation

### Core API

- Controller (TODO)
- Engine (TODO)
- [Entity](docs/Entity.md): is a parent to everything that wants to exist within the `Engine` context
- [Pane](docs/Pane.md): represents an area of the canvas and relates child entities to that area
- Particle (TODO)
- Storage (TODO)
- Timer (TODO)
- Tween (TODO)

### Extended API

- BoundingBox (TODO)
