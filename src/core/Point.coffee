class Point extends Entity

  constructor: (x = 0, y = 0, @_layer = 0) ->
    super(@_layer)

    @_x = null
    @_y = null
    @_tweenX = null
    @_tweenY = null
    @_reference = null
    @_position =
      x: null
      y: null

    @hasChanged = false
    @setPosition(x, y)

  # ----- Public methods ----

  getX: ->
    if @_reference
      return @_reference.getX() + @_x
    else
      return @_x

  getY: ->
    if @_reference
      return @_reference.getY() + @_y
    else
      return @_y

  isValid: (x = @_x, y = @_y) ->
    _isValid = (x isnt NaN) and (y isnt NaN)
    unless _isValid
      console.warn "Point()", x+","+y, "is not a valid Point"
    return _isValid

  moveTo: (x, y, duration = 1000, easing = 'linear') ->
    if @isValid(x, y)
      @moveToX(x, duration, easing)
      @moveToY(y, duration, easing)
      return true
    else
      return false

  # TODO validate parameters
  moveToX: (x, duration = 1000, easing = 'linear') ->
    parameters = []
    parameters.push({ name:'x', from:@_x, to:x })
    @_tweenX = new Tween(parameters, duration, easing)
    return

  # TODO validate parameters
  moveToY: (y, duration = 1000, easing = 'linear') ->
    parameters = []
    parameters.push({ name:'y', from:@_y, to:y })
    @_tweenY = new Tween(parameters, duration, easing)
    return

  setPosition: (x, y) ->
    if @isValid(x, y)
      @_x = x
      @_y = y
      @_updatePosition()
    else
      return false

  setX: (x) ->
    if @isValid(x)
      @_x = x
      @_updatePosition()
    else
      return false

  setY: (y) ->
    if @isValid(y)
      @_y = y
      @_updatePosition()
    else
      return false

  # ----- Private methods -----

  _update: ->
    @hasChanged = false
    _previousX = @_x
    _previousY = @_y

    if @_tweenX
      @_x = Math.round(@_tweenX.getValue('x'))
      if @_tweenX.isComplete then @_tweenX = null
    if @_tweenY
      @_y = Math.round(@_tweenY.getValue('y'))
      if @_tweenY.isComplete then @_tweenY = null

    if (_previousX isnt @_x) or (_previousY isnt @_y)
      @_updatePosition()
    return

  _setReference: (@_reference, @_id) ->

  _updatePosition: ->
    @_position.x = @getX()
    @_position.y = @getY()
    @hasChanged = true
    return true
