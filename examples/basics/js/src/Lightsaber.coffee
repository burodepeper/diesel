class Lightsaber extends Pane

  constructor: ->
    super()

    @color = new Color('#fff')
    @timer = null
    @count = 0
    @speed = getRandomInt(500, 1500) * 2

    # TODO
    # Move the code for the weird lightsaber to its own class, and have for instances of it moving around, each confined to its own {Pane}

    # TODO
    # Create two {Circles}, centered on {@left} and {@right}; they should update their position automatically

    # TODO
    # Create a {Circle}, centered on the center of {@line}

    # TODO
    # Add moving text labels with the current coordinates

  init: ->
    @width = @getWidth() - 1
    @height = @getHeight() - 1

    @a = new Point(getRandomInt(0, @width), getRandomInt(0, @height))
    @b = new Point(getRandomInt(0, @width), getRandomInt(0, @height))

    @line = new Line(LAYER_FOREGROUND)
    @line.setColor(@color)
    @line.from(@a).to(@b)
    return

  pickRandomColor: ->
    values = [0, 3, 6, 9, 'c', 'f']
    color = '#'
    for i in [1 .. 3]
      color += getRandomFromArray(values)
    @color.change(color)
    return

  pickRandomA: ->
    x = getRandomInt(0, @width)
    y = getRandomInt(0, @height)
    @a.moveTo(x, y, @speed)
    return

  pickRandomB: ->
    x = getRandomInt(0, @width)
    y = getRandomInt(0, @height)
    @b.moveTo(x, y, @speed)
    return

  _update: ->
    unless @timer
      @timer = new Timer(@speed / 2)
    else
      if @timer.isComplete
        @pickRandomColor()
        if @count % 2
          @pickRandomA()
        else
          @pickRandomB()
        @timer = null
        @count++
    return
