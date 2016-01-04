# Point
A [Point] describes a position (`x` and `y` coordinates) relative to a `reference`.
```js
new Point( x, y )
```

| parameter | type | default
| --------- | ---- | -------
| x | number | 0
| y | number | 0

## API

### getX
Returns the current value of the `x` coordinate.
```js
float Point.getX()
```

### getY
Returns the current value of the `y` coordinate.
```js
float Point.getY()
```

### hasChanged
Is either true or false, whether it has been changed during the current tick. Any [Entity] that depends on this [Point] can check for `hasChanged` in their `update()` methods.
```js
boolean Point.hasChanged
```

### isValid
Returns `true` if both `x` and `y` are numbers.
```js
boolean Point.isValid( x, y )
```
- Omitting both parameters validates the current coordinates; probably its main usage.

### moveTo
Creates a [Tween] from the current position to a new one. Returns false if the new position is not valid.
```js
boolean Point.moveTo( x, y, duration, easing )
```

| parameter | type | default | note
| --------- | ---- | ------- | ----
| x | number | null
| y | number | null
| duration | number | 1000 | in milliseconds
| easing | string | linear | see [Timer] for options

Behind the scenes, `moveTo()` invokes both `moveToX()` and `moveToY()`.

### moveToX
Creates a [Tween] from the current `x` to a new one.
```js
void Point.moveToX( x, duration, easing )
```
| parameter | type | default | note
| --------- | ---- | ------- | ----
| x | number | null
| duration | number | 1000 | in milliseconds
| easing | string | linear | see [Timer] for options

### moveToY
Creates a [Tween] from the current `y` to a new one. See `moveToX()` for more details, because it works exactly the same.

### setPosition

### setX

### setY
