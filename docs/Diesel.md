# Diesel

---

## Diesel.init

```js
Diesel.init(settings)
```

### settings

`settings` is an object that contains the settings with which to initialize Diesel.

#### settings.viewport

`settings.viewport` is an object that defines how the variably sized browser window dimensions are converted to a viewport that is used by `Engine`. It is possible to define both a width and a height, or either one of them. The pixel-size used by `Engine` is the maximum, unless `settings.maxPixelSize` is specified. The minimum pixel-size is fixed at `1`.

```js
Diesel.init({
  viewport: {
    width: 640,
    height: 360
  }
});
```

```js
Diesel.init({
  viewport: {
    width: 320
  }
});
```

#### settings.pixelSize

```js
Diesel.init({
  pixelSize: 6
});
```

#### settings.maxPixelSize

```js
Diesel.init({
  maxPixelSize: 16
});
```

---
