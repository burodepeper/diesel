class Circle extends Pane

  constructor: (@_layer = 1) ->
    super(@_layer)

    @diameter = null
    @radius = null
    @center = new Point(0, 0)
    @type = null
    @hasOutline = false

  fill: (color = null, opacity = null) ->
    @type = 'fill'
    if color? then @setColor(color, opacity)
    return

  stretch: (color = null, opacity = null) ->
    @type = 'stretch'
    if color? then @setColor(color, opacity)
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

    # NOTE
    # The number of samples needed to accurately calculate a minY for every x is relative to @diameter
    samples = Math.ceil(@diameter * Math.PI)
    increment = 180 / samples
    angle = 0
    for i in [0 .. samples - 1]
      radians = angle * (Math.PI / 180)
      x = Math.ceil(@center.x + (Math.cos(radians) * @radius))
      y = Math.ceil(@center.y - (Math.sin(radians) * @radius))
      if (y < minY[x]) then minY[x] = y
      angle += increment

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
          minY = @getMinY()
          fromY = Math.round(@radius - 1)
          for toY, x in minY

            # Use only half of minY (top left quadrant of the Circle),
            # fill in the gaps, and horizontally duplicate each particle,
            # then vertically duplicate each particle to create the lower half of the ouline
            if x < @radius

              # In horizontal areas (where the y coordinate doesn't change), fromY can never be smaller than toY
              if fromY < toY then fromY = toY
              for y in [fromY .. toY]

                # Mirrored x and y coordinates
                _x = (@diameter - 1) - x
                _y = (@diameter - 1) - y

                positions = []
                positions.push({ x:x, y:y })

                # If any of the mirrored coordinates is larger than or equal to @radius its mirror should not be drawn because it will overlap an existing particle
                if _x >= @radius
                  positions.push({ x:_x, y:y })
                if _y >= @radius
                  positions.push({ x:x, y:_y })
                if _x >= @radius and _y >= @radius
                  positions.push({ x:_x, y:_y })

                for position in positions
                  particle = @getParticle(i)
                  particle.setPosition(position.x, position.y)
                  particle.setColor(@outlineColor)
                  particle.show()
                  i++

              # The fromY coordinate for the next {Particle} is set to be 1 lower than the current toY. This prevents any overlap, and thus insures that a 1px outline is drawn.
              fromY = toY - 1


        # TODO
        # hide particles larger than i

        @hasChanged = false
