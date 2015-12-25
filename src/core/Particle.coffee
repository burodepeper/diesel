
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
    @color =
      r: 255
      g: 255
      b: 255
      a: 1
    @size =
      width: 1
      height: 1
    @reference = WINDOW

    @isVisible = true

  setReference: (@reference, @_particleID) ->

  setPosition: (x, y) ->
    @position.relative = {x, y}
    return

  setSize: (width, height) ->
    @size = {width, height}
    return

  setOpacity: (opacity) ->
    @color.a = parseFloat(opacity)
    return

  setColor: (color) ->
    color = color.replace(/[ ]+/g, '').toLowerCase()

    if (color.length is 7) and color.match(/#[0-9a-f]{6}/)
      @color.r = parseInt(color.substring(1, 3), 16)
      @color.g = parseInt(color.substring(3, 5), 16)
      @color.b = parseInt(color.substring(5, 7), 16)

    else if (color.length is 4) and color.match(/#[0-9a-f]{3}/)
      r = parseInt(color.substring(1, 2), 16)
      g = parseInt(color.substring(2, 3), 16)
      b = parseInt(color.substring(3, 4), 16)
      @color.r = (r * 16) + r
      @color.g = (g * 16) + g
      @color.b = (b * 16) + b

    else if match = color.match(/rgba\(([0-9]+),([0-9]+),([0-9]+),([\.0-9]+)\)/)
      @color.r = parseInt(match[1])
      @color.g = parseInt(match[2])
      @color.b = parseInt(match[3])
      @color.a = parseFloat(match[4])

    else
      console.log "Particle.setColor()", this, "color '#{color}' is not valid"

    return

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
      CONTEXT.fillStyle = @getColor()
      CONTEXT.fillRect(left, top, width, height)
    return

  getColor: ->
    # TODO
    # Check and include opacity of reference
    "rgba(#{@color.r}, #{@color.g}, #{@color.b}, #{@color.a})"

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
