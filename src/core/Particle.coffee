class Particle extends Entity

  color: null
  size:
    width: 1
    height: 1
  reference: WINDOW

  isVisible: true
  hasChanged: false

  constructor: (@_layer = 1) ->
    super(@_layer)
    @position =
      relative: new Point(0, 0)
      # NOTE
      # position.absolute is not a {Point}, because the absolute position is merely a placeholder for the relative position of this {Particle} and all its parents in the hierarchy
      absolute:
        x: 0
        y: 0

  setReference: (@reference, @_particleID) ->
    @color = @reference.getColor()

  setPosition: (x, y) ->

    x = parseFloat(x)
    if x is NaN
      console.warn "Particle.setPosition()", x, "is not a valid value for x"
    else
      @position.relative.x = x

    y = parseFloat(y)
    if y is NaN
      console.warn "Particle.setPosition()", y, "is not a valid value for y"
    else
      @position.relative.y = y

    @hasChanged = true

  setSize: (width, height) ->
    @size = {width, height}
    @hasChanged = true

  setOpacity: (opacity) ->
    if @color? then @color.setOpacity(opacity)
    return

  setColor: (color, opacity = null) ->
    if typeof color is 'object'
      @color = color
    else
      @color.set(color)
    if opacity? then @setOpacity(opacity)
    return

  update: ->
    if @hasChanged
      x = @reference.getX() + @position.relative.x
      y = @reference.getY() + @position.relative.y
      if (x isnt NaN) and (y isnt NaN)
        @position.absolute.x = x
        @position.absolute.y = y
      else
        console.warn "Particle.update()", x+","+y, "is not a valid position"
      @hasChanged = false
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
