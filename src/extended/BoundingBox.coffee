class BoundingBox extends Pane

  extension: 7
  padding: 3

  constructor: ->
    super(1)

  # TODO
  # Remove the need to define a color for the BoundingBox by generating a default 'opposite' color, based on reference.color. setColor() can still exist to manually overwrite this.
  setColor: (color) ->
    if typeof color is 'object'
      @color = color
    else
      @color = new Color(color)

  update: ->

    if @reference.constructor.name is 'Line'
      @left = @reference.position.absolute.x * PX
      @top = @reference.position.absolute.y * PX
    else
      @left = @reference.getX() * PX
      @top = @reference.getY() * PX

    @right = @left + (@reference.getWidth() * PX)
    @bottom = @top + (@reference.getHeight() * PX)

  draw: ->
    CONTEXT.strokeStyle = @color
    CONTEXT.lineWidth = 0.5

    CONTEXT.beginPath()
    CONTEXT.moveTo(@left - @extension, @top - @padding)
    CONTEXT.lineTo(@right + @extension, @top - @padding)

    CONTEXT.moveTo(@right + @padding, @top - @extension)
    CONTEXT.lineTo(@right + @padding, @bottom + @extension)

    CONTEXT.moveTo(@right + @extension, @bottom + @padding)
    CONTEXT.lineTo(@left - @extension, @bottom + @padding)

    CONTEXT.moveTo(@left - @padding, @bottom + @extension)
    CONTEXT.lineTo(@left - @padding, @top - @extension)

    CONTEXT.closePath()
    CONTEXT.stroke()

    return
