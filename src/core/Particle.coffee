class Particle extends Point

  constructor: (@_layer = 1, x = 0, y = 0) ->
    super(x, y, @_layer)

    # @_color = null
    @_color = new Color('#fff')
    @_opacity = 1
    @_size =
      width: 1
      height: 1
    @_isVisible = true
    @_reference = WINDOW

    # @setPosition(x, y)

  # setSize: (width, height) ->
  #   @size = {width, height}
  #   @hasChanged = true

  # setOpacity: (opacity) ->
  #   if @color? then @color.setOpacity(opacity)
  #   @hasChanged = true
  #   return

  # setColor: (color, opacity = null) ->
  #   if typeof color is 'object'
  #     @color = color
  #   else
  #     @color.set(color)
  #   if opacity? then @setOpacity(opacity)
  #   return

  _setReference: (reference, particleID) ->
    super(reference, particleID)
    # @color = @reference.getColor()

  isVisible: ->
    return @_isVisible

  draw: ->
    if @isVisible()
      left = snap(@_position.x * PX)
      top = snap(@_position.y * PX)
      width = snap(@_size.width * PX)
      height = snap(@_size.height * PX)
      CONTEXT.fillStyle = @_color
      CONTEXT.fillRect(left, top, width, height)
    return

  show: ->
    @_isVisible = true
    return this

  hide: ->
    @_isVisible = false
    return this

  # isWithinBounds: ->
  #   return (@isWithinHorizontalBounds() and @isWithinVerticalBounds())
  #
  # isWithinHorizontalBounds: (x = @position.relative.x) ->
  #   aboveLower = x >= 0
  #   belowUpper = x <= (@reference.getWidth() - 1)
  #   return (aboveLower and belowUpper)
  #
  # isWithinVerticalBounds: (y = @position.relative.y) ->
  #   aboveLower = y >= 0
  #   belowUpper = y <= (@reference.getHeight() - 1)
  #   return (aboveLower and belowUpper)
