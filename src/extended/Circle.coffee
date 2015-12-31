class Circle extends Pane

  radius: null
  center: new Point(0, 0)
  type: 'outline'

  constructor: (@_layer = 1) ->
    super(@_layer)

  setCenter: (x, y) ->
    @center = isPoint(x, y)
    unless @center
      console.warn "Circle.setCenter() is not valid"

  setRadius: (@radius) ->
    @hasChanged = true

  update: ->

    if @hasChanged
      if @center and @radius

        if @type is 'outline'

          i = 0
          for angle in [0 .. 359]
            radians = angle * (Math.PI / 180)
            x = @center.x + (Math.cos(radians) * @radius)
            y = @center.y - (Math.sin(radians) * @radius)
            particle = @getChild(i)
            particle.setPosition(x, y)
            particle.show()
            i++

        else if @type is 'fill'

          i = 0
          for x in [0 .. @radius * 2]
            for y in [0 .. @radius * 2]
              diffX = @center.x - x
              diffY = @center.y - y
              distanceFromCenter = Math.sqrt((diffX * diffX) + (diffY * diffY))
              if distanceFromCenter < @radius
                particle = @getChild(i)
                particle.setPosition(x, y)
                particle.show()
                i++

        @hasChanged = false
