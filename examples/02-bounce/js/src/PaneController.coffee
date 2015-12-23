class PaneController extends Controller

  size: null
  y: null
  speed: null
  color: null

  init: ->
    if @size? and @y? and @color?

      @pane = new Pane()
      @pane.setSize(@size, @size)
      @pane.setPosition(0, @y)

      for i in [1 .. @size]
        particle = new BouncingParticle()
        @pane.addChild(particle)
        particle.setColor(@color)
        particle.setRandomPosition()
        particle.setRandomMomentum()

      @setState('left-to-right')

  # Calculate new position of @pane,
  # check if @pane is still within its reference,
  # otherwise reverse direction (ie, @speed)
  update: ->

    switch @state

      when 'tween'
        x = @tween.getValue('x')
        y = @pane.position.relative.y
        @pane.setPosition(x, y)
        if @tween.isComplete
          @setState(@nextState)

      when 'left-to-right'
        right = @pane.reference.getWidth() - @pane.getWidth()
        parameters = []
        parameters.push({ name:'x', from:0, to:right })
        @tween = new Tween(parameters, 3000, 'ease-in-out')
        @setState('tween', 'right-to-left')

      when 'right-to-left'
        right = @pane.reference.getWidth() - @pane.getWidth()
        parameters = []
        parameters.push({ name:'x', from:right, to:0 })
        @tween = new Tween(parameters, 3000, 'ease-in-out')
        @setState('tween', 'left-to-right')

  setSize: (@size) ->

  setY: (@y) ->

  setSpeed: (@speed) ->

  setColor: (@color) ->
