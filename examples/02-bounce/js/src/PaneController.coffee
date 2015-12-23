class PaneController extends Controller

  size: null
  y: null
  speed: null
  color: null

  init: ->
    if @size? and @y? and @speed? and @color?
      @pane = new Pane()
      @pane.setSize(@size, @size)
      @pane.setPosition(0, @y)
      for i in [1 .. @size]
        particle = new BouncingParticle()
        @pane.addChild(particle)
        particle.setColor(@color)
        particle.setRandomPosition()
        particle.setRandomMomentum()

  # Calculate new position of @pane,
  # check if @pane is still within its reference,
  # otherwise reverse direction (ie, @speed)
  update: ->
    {x, y} = @pane.position.relative
    newX = x + @speed
    if @pane.isWithinBounds(newX)
      @pane.setPosition(newX, y)
    else
      @speed = 0 - @speed
    super()

  setSize: (@size) ->

  setY: (@y) ->

  setSpeed: (@speed) ->

  setColor: (@color) ->
