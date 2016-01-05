class Particle extends VisualEntity

  constructor: (@_layer = 1, x = 0, y = 0) ->
    super(x, y, @_layer)

    @_size =
      width: 1
      height: 1
    @_reference = WINDOW
    @_init()

  # setSize: (width, height) ->
  #   @size = {width, height}
  #   @hasChanged = true



  # TODO move within-bounds methods to {Point} ?

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

  # ----- Private methods -----

  _draw: ->
    if @isVisible() and @_color
      left = snap(@_position.x * PX)
      top = snap(@_position.y * PX)
      width = snap(@_size.width * PX)
      height = snap(@_size.height * PX)
      CONTEXT.fillStyle = @_color.get(@opacity)
      CONTEXT.fillRect(left, top, width, height)
    return

  _setReference: (reference, id) ->
    super(reference, id)
    @setColor(reference.getColor())
