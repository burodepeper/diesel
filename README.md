# diesel-engine

A simple 2d, particle-based (game) engine using web-technology.

## Work in progress

Currently in the process of being rewritten to become open-source. Current content should all be considered temporary, but feel free to follow the progress.

## API / Documentation

[Pane](docs/Pane.md)

## Examples

### 01) Bouncing particles

The canvas is divided in three columns, and each column is populated with 40 randomly bouncing particles.

- Viewport with fixed dimensions adapts `PX` to size of browser
- Multiple variations of `Pane.setCSS()`
- Custom `BouncingParticle` that extends `Particle`
