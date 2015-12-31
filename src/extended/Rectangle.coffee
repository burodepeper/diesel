class Rectangle extends Pane

  type: 'stretch'

  constuctor: (@_layer = 1) ->
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

  update: ->

    if @type is 'stretch'

      particle = @getParticle(0).show()
      particle.setPosition(@position.absolute.x, @position.absolute.y)
      particle.setSize(@size.width, @size.height)
      i = 1

      if @hasOutline
        particle = @getParticle(i)
        particle.setPosition(0, 0)
        particle.setSize(@size.width, 1)
        particle.setColor(@outlineColor)
        i++
        particle = @getParticle(i)
        particle.setPosition(0, @size.height - 1)
        particle.setSize(@size.width, 1)
        particle.setColor(@outlineColor)
        i++
        particle = @getParticle(i)
        particle.setPosition(0, 1)
        particle.setSize(1, @size.height - 2)
        particle.setColor(@outlineColor)
        i++
        particle = @getParticle(i)
        particle.setPosition(@size.width - 1, 1)
        particle.setSize(1, @size.height - 2)
        particle.setColor(@outlineColor)
        i++

      if (@particles.length - 1) > i
        for j in [i .. @particles.length - 1]
          @getParticle(j).hide()

    else if @type is 'fill'

      i = 0
      for x in [0 .. @size.width - 1]
        for y in [0 .. @size.height - 1]
          particle = @getParticle(i)
          particle.setPosition(x, y)
          particle.show()
          i++

      if @hasOutline
        for x in [0 .. @size.width - 1]
          for y in [0, @size.height - 1]
            particle = @getParticle(i)
            particle.setPosition(x, y)
            particle.setColor(@outlineColor)
            particle.show()
            i++
        for y in [1 .. @size.height - 2]
          for x in [0, @size.width - 1]
            particle = @getParticle(i)
            particle.setPosition(x, y)
            particle.setColor(@outlineColor)
            particle.show()
            i++

      if (@particles.length - 1) > i
        for j in [i .. @particles.length - 1]
          @getParticle(j).hide()
