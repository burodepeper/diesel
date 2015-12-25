class Line extends Pane

  _from: null
  _to: null
  _angle: null
  length: 0

  constructor: (@_layer = 1) ->
    super(@_layer)

  from: (@_from) ->
    return this

  to: (@_to) ->
    return this

  # @_angle is between 0 and 360 degrees,
  # 0 is up, 90 is right, 180 is down, 270 is left
  # @offset is a optional float that specifies from what percentage the line should be drawn (if not from the origine, but if origine is known)
  atAngle: (@_angle, @length, @offset = 0) ->
    # TODO calculate @_to
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
        particle = @getParticle(i)
        particle.setPosition(x, y)
        y += increment
        i++

    else
      x = @_from.x
      increment = @diffX / Math.abs(@diffY)
      for y in [@_from.y .. @_to.y]
        particle = @getParticle(i)
        particle.setPosition(x, y)
        x += increment
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
