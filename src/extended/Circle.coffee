class Circle extends Pane

  diameter: null
  radius: null
  center: new Point(0, 0)
  type: 'stretch'

  constructor: (@_layer = 1) ->
    super(@_layer)

    @hasOutline = false

  fill: (color = null) ->
    @type = 'fill'
    return

  stretch: (color = null) ->
    @type = 'stretch'
    return

  outline: (color) ->
    @outlineColor = color
    @hasOutline = true
    return

  setSize: (@diameter) ->
    super(@diameter, @diameter)
    @updateDimensions()
    return

  updateDimensions: ->
    if @diameter
      @radius = @diameter / 2
      @center.x = (@getWidth() - 1) / 2
      @center.y = (@getHeight() - 1) / 2
      @hasChanged = true

  getMinY: ->
    minY = []
    for x in [0 .. @diameter - 1]
      minY.push(@diameter)

    for angle in [0 .. 179]
      radians = angle * (Math.PI / 180)
      x = Math.round(@center.x + (Math.cos(radians) * @radius))
      y = Math.round(@center.y - (Math.sin(radians) * @radius))
      if (y < minY[x]) then minY[x] = y

    return minY

  update: ->

    if @hasChanged
      if @center and @radius

        i = 0

        if @type is 'fill'
          for x in [0 .. @diameter]
            for y in [0 .. @diameter]
              diffX = @center.x - x
              diffY = @center.y - y
              distanceFromCenter = Math.sqrt((diffX * diffX) + (diffY * diffY))
              if distanceFromCenter < @radius
                particle = @getParticle(i)
                particle.setPosition(x, y)
                particle.show()
                i++

        else if @type is 'stretch'
          minY = @getMinY()
          for y, x in minY
            height = @diameter - (y * 2)
            particle = @getParticle(i)
            particle.setPosition(x, y)
            particle.setSize(1, height)
            particle.show()
            i++

        if @hasOutline
          for angle in [0 .. 359]
            radians = angle * (Math.PI / 180)
            x = Math.round(@center.x + (Math.cos(radians) * @radius))
            y = Math.round(@center.y - (Math.sin(radians) * @radius))
            particle = @getParticle(i)
            particle.setPosition(x, y)
            particle.setColor(@outlineColor)
            particle.show()
            i++

        # TODO
        # hide particles larger than i

        @hasChanged = false
