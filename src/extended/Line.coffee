class Line extends Pane

  _from: null
  _to: null
  _angle: null
  length: 0
  offset: 0
  weight: 1

  constructor: (@_layer = 1) ->
    super(@_layer)

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
  setWeight: (@weight) ->

  # @_angle is between 0 and 360 degrees,
  # 0 is up, 90 is right, 180 is down, 270 is left
  # @offset is a optional float that specifies from what percentage the line should be drawn (if not from the origin, but if origin is known)
  atAngle: (@_angle, @length, @offset = 0) ->
    # TODO calculate @_to
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

  calculateLength: ->
    if @_from? and @_to?
      @diffX = @_to.x - @_from.x
      @diffY = @_to.y - @_from.y
      @length = Math.sqrt((@diffX * @diffX) + (@diffY * @diffY))
      # TODO calculate @_angle
    return @length

  update: ->

    i = 0
    @calculateLength()

    if Math.abs(@diffX) >= Math.abs(@diffY)
      y = @_from.y
      increment = @diffY / Math.abs(@diffX)
      for x in [@_from.x .. @_to.x]
        particle = @getChild(i)
        particle.setPosition(x, y)
        particle.show()
        y += increment
        i++

    else
      x = @_from.x
      increment = @diffX / Math.abs(@diffY)
      for y in [@_from.y .. @_to.y]
        particle = @getChild(i)
        particle.setPosition(x, y)
        particle.show()
        x += increment
        i++

    if @offset
      for j in [0 .. Math.round(i * @offset)]
        @getChild(j).hide()

    if (@children.length - 1) > i
      for j in [i .. @children.length - 1]
        @getChild(j).hide()
