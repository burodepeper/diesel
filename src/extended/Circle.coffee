class Circle extends Pane

  radius: null
  center: null

  constructor: (@_layer = 1) ->
    super(@_layer)

  setCenter: (@center) ->

  setRadius: (@radius) ->

  update: ->

    if @center and @radius
      i = 0
      for angle in [0 .. 359]
        radians = angle * (Math.PI / 180)
        x = @center.x + (Math.cos(radians) * @radius)
        y = @center.y - (Math.sin(radians) * @radius)
        particle = @getChild(i)
        particle.setPosition(x, y)
        particle.show()
        i++
