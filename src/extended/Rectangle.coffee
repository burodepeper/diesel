class Rectangle extends Pane

  type: 'stretch'

  constuctor: (@_layer = 1) ->
    super(@_layer)

  update: ->

    if @type is 'stretch'

      particle = @getChild(0).show()
      particle.setPosition(@position.absolute.x, @position.absolute.y)
      particle.setSize(@size.width, @size.height)

      if @children.length > 1
        for j in [1 .. @children.length - 1]
          @getChild(j).hide()

    else if @type is 'fill'

      i = 0
      for x in [0 .. @size.width]
        for y in [0 .. @size.height]
          particle = @getChild(i)
          particle.setPosition(x, y)
          particle.show()
          i++

      if (@children.length - 1) > i
        for j in [i .. @children.length - 1]
          @getChild(j).hide()
