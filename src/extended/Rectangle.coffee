class Rectangle extends Pane

  constuctor: (@_layer = 1) ->
    super(@_layer)

  update: ->
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
