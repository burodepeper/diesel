class Rectangle extends Pane

  type: null

  constuctor: (@_layer = 1) ->
    super(@_layer)
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

  _update: ->

    if @type is 'stretch'

      particle = @getParticle(0).show()
      # particle.setPosition(@_position.x, @_position.y)
      particle.setPosition(0, 0);
      particle.setSize(@_dimensions.width, @_dimensions.height)
      i = 1

      # if @hasOutline
      #   particle = @getParticle(i)
      #   particle.setPosition(0, 0)
      #   particle.setSize(@_dimensions.width, 1)
      #   particle.setColor(@outlineColor)
      #   i++
      #   particle = @getParticle(i)
      #   particle.setPosition(0, @_dimensions.height - 1)
      #   particle.setSize(@_dimensions.width, 1)
      #   particle.setColor(@outlineColor)
      #   i++
      #   particle = @getParticle(i)
      #   particle.setPosition(0, 1)
      #   particle.setSize(1, @_dimensions.height - 2)
      #   particle.setColor(@outlineColor)
      #   i++
      #   particle = @getParticle(i)
      #   particle.setPosition(@_dimensions.width - 1, 1)
      #   particle.setSize(1, @_dimensions.height - 2)
      #   particle.setColor(@outlineColor)
      #   i++

      if (@_particles.length - 1) > i
        for j in [i .. @_particles.length - 1]
          @getParticle(j).hide()

    else if @type is 'fill'

      i = 0
      for x in [0 .. @_dimensions.width - 1]
        for y in [0 .. @_dimensions.height - 1]
          particle = @getParticle(i)
          particle.setPosition(x, y)
          particle.show()
          i++

      # if @hasOutline
      #   for x in [0 .. @_dimensions.width - 1]
      #     for y in [0, @_dimensions.height - 1]
      #       particle = @getParticle(i)
      #       particle.setPosition(x, y)
      #       particle.setColor(@outlineColor)
      #       particle.show()
      #       i++
      #   for y in [1 .. @_dimensions.height - 2]
      #     for x in [0, @_dimensions.width - 1]
      #       particle = @getParticle(i)
      #       particle.setPosition(x, y)
      #       particle.setColor(@outlineColor)
      #       particle.show()
      #       i++

      if (@_particles.length - 1) > i
        for j in [i .. @_particles.length - 1]
          @getParticle(j).hide()
