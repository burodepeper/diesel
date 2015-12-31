class Particle extends Entity

  constructor: (@_layer = 1) ->
    super()

    @position =
      relative:
        x: 0
        y: 0
      absolute:
        x: 0
        y: 0
    @color = new Color()
    @size =
      width: 1
      height: 1
    @reference = WINDOW

    @isVisible = true

  setReference: (@reference, @_particleID) ->
    @color = @reference.getColor()

  setPosition: (x, y) ->
    @position.relative = {x, y}
    return

  setSize: (width, height) ->
    @size = {width, height}
    return

  setOpacity: (opacity) ->
    @color.setOpacity(opacity)

  setColor: (color) ->
    if typeof color is 'object'
      @color = color
    else
      @color.set(color)

  update: ->
    @position.absolute.x = @reference.getX() + @position.relative.x
    @position.absolute.y = @reference.getY() + @position.relative.y
    return

  draw: ->
    if @isVisible and (@color.a > 0)
      left = snap(@position.absolute.x * PX)
      top = snap(@position.absolute.y * PX)
      width = snap(@size.width * PX)
      height = snap(@size.height * PX)
      CONTEXT.fillStyle = @color
      CONTEXT.fillRect(left, top, width, height)
    return

  show: ->
    @isVisible = true
    return this

  hide: ->
    @isVisible = false
    return this

  isWithinBounds: ->
    return (@isWithinHorizontalBounds() and @isWithinVerticalBounds())

  isWithinHorizontalBounds: (x = @position.relative.x) ->
    aboveLower = x >= 0
    belowUpper = x <= (@reference.getWidth() - 1)
    return (aboveLower and belowUpper)

  isWithinVerticalBounds: (y = @position.relative.y) ->
    aboveLower = y >= 0
    belowUpper = y <= (@reference.getHeight() - 1)
    return (aboveLower and belowUpper)

  getX: ->
    return @position.relative.x

  getY: ->
    return @position.relative.y
