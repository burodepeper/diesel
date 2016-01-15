class Spaceship extends Controller

  constructor: ->
    super()
    @_speed = 0
    @_accelerationTween = null

  getSpeed: ->
    return @_speed

  setSpeed: (@_speed) ->

  accelerateTo: (speed) ->
    parameters = []
    parameters.push({ name:'speed', from:@_speed, to:speed })
    @_accelerationTween = new Tween(parameters, 5000, 'linear')
    return

  _update: ->
    if @_accelerationTween?
      @setSpeed(@_accelerationTween.getValue('speed'))
      if @_accelerationTween.isComplete
        @_accelerationTween = null
