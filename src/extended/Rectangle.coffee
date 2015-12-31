class Rectangle extends Pane

  type: 'stretch'

  constuctor: (@_layer = 1) ->
    super(@_layer)

  update: ->

    if @type is 'stretch'

      particle = @getParticle(0).show()
      particle.setPosition(@position.absolute.x, @position.absolute.y)
      particle.setSize(@size.width, @size.height)

      if @particles.length > 1
        for j in [1 .. @particles.length - 1]
          @getParticle(j).hide()

    else if @type is 'fill'

      i = 0
      for x in [0 .. @size.width]
        for y in [0 .. @size.height]
          particle = @getParticle(i)
          particle.setPosition(x, y)
          particle.show()
          i++

      if (@particles.length - 1) > i
        for j in [i .. @particles.length - 1]
          @getParticle(j).hide()
