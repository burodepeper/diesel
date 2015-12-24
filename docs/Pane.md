# Pane

A `Pane` is used to specify an area of your canvas. It is a logical, invisible `Entity` that can be used to group entities, and to act as their frame of reference. A child element of a `Pane`, whether visible or not, is positioned relative to the position of that `Pane`.

> The global variable `WINDOW`, an instance of `Pane`, is set as default reference for newly created entities. The position and size of `WINDOW` is maintained by `Engine` and defined by the parameters of the `viewport` it is initialized with.

## Usage

The position and size of a `Pane` can be set directly by using the `setPosition()` and `setSize()` methods. In most (simple) cases, it is advisable however to use the higher level method `setCSS()` which allows you to define the size and position via options similar to `CSS`.

As a frame of reference, panes also allow you to manipulate certain key attributes which are then applied to all its children. For instance, setting the default `opacity` to 50% will apply this value to all children. A `Particle` with a private opacity of 50%, and a parent opacity of 50%, will therefore have an absolute opacity of 25%.

## API

### addChild

Adds a child to the internal pool of children, and sets itself as the reference for the `Entity`.

```coffeescript
pane = new Pane()
particle = new Particle()
pane.addChild(particle)
```

### getHeight

Returns the height of the `Pane` in `PX`.

```coffeescript
rows = WINDOW.getHeight()
```

<!-- ### getOpacity -->

### getWidth

Returns the width of the `Pane` in `PX`.

```coffeescript
columns = WINDOW.getWidth()
```

### getX

Returns the absolute x coordinate of the `Pane` in `PX`.

```coffeescript
left = WINDOW.getX() * PX
```

### getY

Returns the absolute y coordinate of the `Pane` in `PX`.

```coffeescript
top = WINDOW.getY() * PX
```

### isWithinBounds

```js
boolean isWithinBounds ( float x, float y, float width, float height )
```

Returns whether this instance of `Pane` is within the boundaries of its reference. The parameters default to their current values. Manually setting these parameters allows you to check if a virtual version of a `Pane` is within the bounds of the reference of the current instance.

```coffeescript
pane = new Pane()
pane.setPosition(-1, -1)
pane.isWithinBounds() # returns false, because it falls outside of WINDOW
```

```coffeescript
pane = new Pane()
pane.setPosition(0, 0)
pane.setSize(10, 10)
newX = 10
if pane.isWithinBounds(newX, 0)
  pane.setPosition(newX, 0)
```

### setCSS

```js
void setCSS ( object properties )
```

Sets the CSS properties, which calculates size and position whenever `onResize()` is called. Under the hood, `setCSS()` uses `setPosition()` and `setSize()`.

`properties` is expected to be a simple key/value based object. Each key/value pair is passed to `setCSSProperty()` to be interpreted. It is possible to set contradicting values, and to counteract this, `onResize()` interprets the values in the following order (only shown for horizontal positioning; vertical positioning follow the same logic):

1. `left` equals `center`, and `width` is valid
2. `left` and `right` are valid
3. `left` is valid
4. `right` and `width` are valid

```coffeescript
pane = new Pane()
css =
  left: 'center'
  width: 40
  top: 10
  bottom: 10
pane.setCSS(css)
```

### setCSSProperty

```js
void setCSSProperty ( string key, mixed value )
```

Sets a specific CSS property.

Accepted keys are `top`, `right`, `bottom`, `left`, `width` and `height`. All others are ignored.

At this time, the value of `value` is expected to be an int, expect for `top` and `left` which allow a value of `center`.

### setOpacity

```js
void setOpacity ( float opacity = 1 )
```

Sets the base opacity level of the `Pane`.

`opacity` must be a `float` with a value between 0 and 1. Invalid values for `opacity` will throw a warning, and the default value of 1 will be used.

### setPosition

```js
void setPosition ( float x, float y )
```

Sets the relative position of a `Pane` in `PX`.

`x` and `y` are technically allowed to be floats, but they are most often used an integers.

### setSize

```js
void setSize ( float width, float height )
```

Sets the size of a `Pane` in `PX` and calculates the `surface` and `circumference` properties.

`width` and `height` are technically allowed to be floats, but they are most often used an integers.
