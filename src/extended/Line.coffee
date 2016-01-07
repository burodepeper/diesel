class Line extends Pane

  constructor: (@_layer = 1) ->
    super(@_layer)

    @_from = null
    @_to = null
    @_angle = null

    @length = 0
    @offset = 0
    @weight = 1

  from: (x, y) ->
    @_from = isPoint(x, y)
    unless @_from
      console.warn "Line.from() is not valid"
    return this

  to: (x, y) ->
    @_to = isPoint(x, y)
    unless @_to
      console.warn "Line.to() is not valid"
    return this

  # TODO
  # setWeight: (@weight) ->

  # @_angle is between 0 and 360 degrees,
  # 0 is up, 90 is right, 180 is down, 270 is left
  # @offset is a optional float that specifies from what percentage the line should be drawn (if not from the origin, but if origin is known)
  atAngle: (@_angle, @length, @offset = 0) ->
    x = @_from.x
    y = @_from.y

    degrees = ((360 - @_angle) + 90) % 360
    radians = degrees * (Math.PI / 180)

    x += Math.cos(radians) * @length
    y -= Math.sin(radians) * @length

    unless @_to
      @_to = new Point(x, y)
    else
      @_to.x = x
      @_to.y = y

    return this

  getLength: ->
    return @length

  _calculateDimensions: ->
    if @_from? and @_to?
      @diffX = @_to.getX() - @_from.getX()
      @diffY = @_to.getY() - @_from.getY()
      @width = Math.abs(@diffX)
      @height = Math.abs(@diffY)
      @length = Math.sqrt((@width * @width) + (@height * @height))
      x = Math.min(@_to.getX(), @_from.getY())
      y = Math.min(@_to.getX(), @_from.getY())
      @setSize(@width, @height)
      # TODO calculate @_angle
    return

  _update: ->

    i = 0
    @_calculateDimensions()

    if Math.abs(@diffX) >= Math.abs(@diffY)
      y = @_from.getY()
      increment = @diffY / Math.abs(@diffX)
      for x in [@_from.getX() .. @_to.getX()]
        particle = @getParticle(i)
        particle.setPosition(x, y)
        particle.show()
        y += increment
        i++

    else
      x = @_from.getX()
      increment = @diffX / Math.abs(@diffY)
      for y in [@_from.getY() .. @_to.getY()]
        particle = @getParticle(i)
        particle.setPosition(x, y)
        particle.show()
        x += increment
        i++

    if @offset
      for j in [0 .. Math.floor(i * @offset)]
        @getParticle(j).hide()

    if (@_particles.length - 1) > i
      for j in [i .. @_particles.length - 1]
        @getParticle(j).hide()
