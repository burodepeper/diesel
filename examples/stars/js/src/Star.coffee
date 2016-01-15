class Star extends Particle

  # TODO
  # Changing the value of {_viewportDistance} doesn't seem to have any effect. Test if it can be removed entirely, because it saves a lot of calculations
  _viewportDistance: 10
  _maxDistance: 10000
  _trackingDistance: 100

  constructor: (@_layer) ->
    super(@_layer)

    @_offsetX = @_reference.getWidth() / 2
    @_offsetY = @_reference.getHeight() / 2
    @_xMultiplier = (@_offsetX / @_viewportDistance) * Math.sqrt(2)
    @_yMultiplier = (@_offsetX / @_viewportDistance) * Math.sqrt(2)

  setCoordinates: (@x, @y, @z) ->
    @passingDistance = Math.sqrt(@x * @x + @y * @y)
    @maxOpacity = 1 - (@passingDistance / (@_offsetX * @_offsetY))
    @_calculatePosition()
    @_calculateOpacity()
    if @passingDistance <= @_trackingDistance
      @_tracker = App.radar.track(this, @passingDistance <= 50)

  _update: ->

    if (@z < Math.abs(@x)) or (@z < Math.abs(@y))
      if @_tracker?
        @_tracker.remove()
      @remove()
      App.stars.addStar()

    else
      @_calculatePosition()
      @_calculateOpacity()
      @z -= App.spaceship.getSpeed()

  _calculatePosition: ->
    xDistance = Math.sqrt(@z * @z + @x * @x)
    x = @x * (@_viewportDistance / xDistance) * @_xMultiplier
    yDistance = Math.sqrt(@z * @z + @y * @y)
    y = @y * (@_viewportDistance / yDistance) * @_yMultiplier
    @setPosition(@_offsetX + x, @_offsetY + y)

    @_distance = (xDistance + yDistance) / 2
    return

  _calculateOpacity: ->
    opacity = 1 - (@_distance / @_maxDistance)
    opacity = if opacity < 0.1 then 0 else Math.pow(opacity, 5)
    if opacity > @maxOpacity then opacity = @maxOpacity
    @setOpacity(opacity)
    return
