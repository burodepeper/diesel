class Controller extends Entity

  constructor: ->
    super()

    @color = new Color('#fff')

    @a = new Point(24, 24)
    @b = new Point(74, 74)

    @line = new Line(LAYER_FOREGROUND)
    @line.setColor(@color)
    @line.from(@a).to(@b)

    @timer = null
    @count = 0

    # TODO
    # Create two circles, centered on {@left} and {@right}; they should update their position automatically

    # TODO
    # Add text labels with the current coordinates

  pickRandomColor: ->
    values = [0, 3, 6, 9, 'c', 'f']
    color = '#'
    for i in [1 .. 3]
      color += getRandomFromArray(values)
    @color.change(color)
    return

  pickRandomA: ->
    x = getRandomInt(0, 99)
    y = getRandomInt(0, 99)
    @a.moveTo(x, y, 2000)
    return

  pickRandomB: ->
    x = getRandomInt(0, 99)
    y = getRandomInt(0, 99)
    @b.moveTo(x, y, 2000)
    return

  _update: ->
    unless @timer
      @timer = new Timer(1000)
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
