class Lightsaber extends Pane

  constructor: ->
    super()

    @color = new Color('#fff')
    @timer = null
    @count = 0
    @speed = getRandomInt(1000, 1500) * 2

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

    @center = new Point(0,0)

    @circle = new Circle(LAYER_FOREGROUND)
    @circle.setCenter(@center)
    @circle.setRadius(5)
    @circle.outline(@color)

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

      # Update the center and radius of the {circle}
      x = Math.round(Math.abs((@a.getX() + @b.getX()) / 2))
      y = Math.round(Math.abs((@a.getY() + @b.getY()) / 2))
      @center.setPosition(x, y)
      @circle.setRadius((@line.getLength() / 2) + 1)

      if @timer.isComplete
        @pickRandomColor()
        if @count % 2
          @pickRandomA()
        else
          @pickRandomB()
        @timer = null
        @count++
    return
