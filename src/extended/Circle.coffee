class Circle extends Pane

  constructor: (@_layer = 1) ->
    super(@_layer)

    @_diameter = null
    @_radius = null
    @_center = new Point(0, 0)

    @type = null
    @hasOutline = false

    @_positionHasChanged = true
    @_sizeHasChanged = true

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

  setSize: ->
    if @_radius
      @_diameter = (@_radius * 2) - 1
      @_dimensions.width = @_diameter
      @_dimensions.height = @_diameter
      @_updateDimensions()
      return

  _updateDimensions: ->
    @_dimensions.circumference = Math.PI * @_diameter
    @_dimensions.surface = Math.PI * (@_radius * @_radius)
    return

  _updatePosition: ->
    if @_radius
      x = @_center.getX() - @_radius + 1
      y = @_center.getY() - @_radius + 1
      @_updateDimensions()
      # super(x, y)
      @_x = x
      @_y = y
      super()

  # TODO Non integer values for {@_radius} cause incomplete circles/outlines
  setRadius: (@_radius) ->
    @_diameter = (@_radius * 2) - 1
    @_updatePosition()

  # TODO Verify that the argument is a {Point}
  setCenter: (@_center) ->

  _getMinY: ->
    minY = []
    for x in [0 .. @_diameter - 1]
      minY.push(@_radius)

    # NOTE
    # The number of samples needed to accurately calculate a minY for every x is relative to @diameter
    samples = Math.ceil(Math.PI * @_radius)
    increment = 180 / samples
    angle = 0
    for i in [0 .. samples]
      radians = angle * (Math.PI / 180)
      x = Math.ceil(@_radius - 0.5 + (Math.cos(radians) * (@_radius - 1)))
      y = Math.ceil(@_radius - 0.5 - (Math.sin(radians) * (@_radius - 1))) - 1
      if (y < minY[x - 1]) then minY[x - 1] = y
      angle += increment

    return minY

  _update: ->

    @_updatePosition()

    if @_sizeHasChanged or @_positionHasChanged
      if @_center and @_radius

        i = 0

        if @type is 'fill'
          for x in [0 .. @_diameter]
            for y in [0 .. @_diameter]
              diffX = x - @_radius
              diffY = y - @_radius
              distanceFromCenter = Math.sqrt((diffX * diffX) + (diffY * diffY))
              if distanceFromCenter < @_radius
                particle = @getParticle(i)
                particle.setPosition(x, y)
                particle.show()
                i++

        else if @type is 'stretch'
          minY = @_getMinY()
          for y, x in minY
            height = @_diameter - (y * 2)
            particle = @getParticle(i)
            particle.setPosition(x, y)
            particle.setSize(1, height)
            particle.show()
            i++

        if @hasOutline
          minY = @_getMinY()
          # The first x-coordinate always starts at {@_radius - 1}
          fromY = @_radius - 1
          for toY, x in minY

            # Only use half of the minY coordinates, essentially drawing the upper-left corner. The other points will be mirrored.
            if x < @_radius

              # In horizontal areas (where the y coordinate doesn't change), fromY can never be smaller than toY
              if fromY < toY then fromY = toY

              # The last x-coordinate always has to go down to {@_radius - 1}
              if x is @_diameter - 1 then toY = @_radius - 1

              for y in [fromY .. toY]

                # Mirrored x and y coordinates
                _x = @_diameter - x - 1
                _y = @_diameter - y - 1

                positions = []
                positions.push({ x:x, y:y })

                # Upper-right corner
                if _x >= @_radius
                  positions.push({ x:_x, y:y })

                # Bottom-left corner
                if _y >= @_radius
                  positions.push({ x:x, y:_y })

                # Bottom-right corner
                if _x >= @_radius and _y >= @_radius
                  positions.push({ x:_x, y:_y })

                for position in positions
                  particle = @getParticle(i)
                  particle.setPosition(position.x, position.y)
                  particle.setColor(@outlineColor)
                  particle.show()
                  i++

              # The fromY coordinate for the next {Particle} is set to be 1 lower than the current toY. This prevents any overlap, and thus insures that a 1px outline is drawn.
              fromY = toY - 1

          # Log the amount of particles drawn
          # console.log i


        # Remove trailing particles (larger than i)
        if (@_particles.length - 1) > i
          for j in [i .. @_particles.length - 1]
            @getParticle(j).hide()

        @_positionHasChanged = false
        @_sizeHasChanged = false
