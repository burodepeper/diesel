class Rectangle extends Pane

  type: 'stretch'

  constuctor: (@_layer = 1) ->
    super(@_layer)

  update: ->

    if @type is 'stretch'

      particle = @getParticle(0).show()
      particle.setPosition(@position.absolute.x, @position.absolute.y)
      particle.setSize(@size.width, @size.height)

      if @children.length > 1
        for j in [1 .. @children.length - 1]
          @getParticle(j).hide()

    else if @type is 'fill'

      i = 0
      for x in [0 .. @size.width]
        for y in [0 .. @size.height]
          particle = @getParticle(i)
          particle.setPosition(x, y)
          particle.show()
          i++

      if (@children.length - 1) > i
        for j in [i .. @children.length - 1]
          @getParticle(j).hide()

  getParticle: (i) ->
    if @children[i]
      return @children[i].show()
    else
      particle = new Particle(@_layer)
      @addChild(particle)
      return particle
