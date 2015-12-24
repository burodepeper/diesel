class BoundingBox extends Pane

  color: '#000'

  constructor: ->
    super(1)

  setColor: (@color) ->

  update: ->
    @left = @reference.getX() * PX
    @top = @reference.getY() * PX
    @right = @left + (@reference.getWidth() * PX)
    @bottom = @top + (@reference.getHeight() * PX)

  draw: ->
    CONTEXT.strokeStyle = @color
    CONTEXT.beginPath()
    CONTEXT.moveTo(@left - 1, @top - 1)
    CONTEXT.lineTo(@right + 1, @top - 1)
    CONTEXT.lineTo(@right + 1, @bottom + 1)
    CONTEXT.lineTo(@left - 1, @bottom + 1)
    CONTEXT.lineTo(@left - 1, @top - 1)
    CONTEXT.closePath()
    CONTEXT.stroke()
    return
