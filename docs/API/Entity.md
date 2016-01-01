# Entity

An `Entity` is nothing more than what is needed to exist within the context of `Engine`. On its own, it is nothing. It is rather a (grand)parent to everything else, and supplies various methods and variables that are assumed to exist.

## Usage

An instance of `Entity` will most likely never be created directly, but any other Class will (at some point in its ...) be extended from `Entity`.

## API

### draw

Gets called by `Engine` on every frame, after `update()`. This method should be overwritten if you want your Class to draw something to the canvas.

### remove

Tells `Engine` to remove this instance of `Entity`. The 'private' variables `_layer` and `_entityID` are used by `Engine` to find the correct object in its entity hierarchy.

### setState

```js
void setState ( string state, string nextState )
```

Allows you to define the current (and optionally next state) that your `Entity` is in. The variable `state` can then be used to execute different pieces of code in `update()` for example. Below is an overly simplified example of how `state` and `setState()` can be used to remove a `Particle` after a certain `Tween` has completed.

```coffeescript
class Particle extends Entity
  update: ->
    switch @state
      when 'tween'
        # Apply tween parameters
        if @tween.isComplete
          @setState('self-destruct') # Executed on next cycle of update()
      when 'self-destruct'
        @remove()
      else
        # Do nothing...
```

### update

Gets called by `Engine` on every frame, before `draw()`. This method allows you to update itself on every frame before it is optionally drawn.
