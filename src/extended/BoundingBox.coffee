class BoundingBox extends Pane

  # NOTE
  # {extension} and {padding} are in PX
  extension: 2
  padding: 1

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

    @width = @reference.getWidth() * PX
    @height = @reference.getHeight() * PX

  draw: ->

    padding = @padding * PX
    extension = @extension * PX

    CONTEXT.fillStyle = @color

    top = @top - 1 - padding
    left = @left - 1 - padding - extension
    width = @width + 2 + (padding * 2) + (extension * 2)
    CONTEXT.fillRect(left, top, width, 1)
    top = top + 1 + @height + (padding * 2)
    CONTEXT.fillRect(left, top, width, 1)

    top = @top - 1 - padding - extension
    left = @left - 1 - padding
    height = @height + 2 + (padding * 2) + (extension * 2)
    CONTEXT.fillRect(left, top, 1, height)
    left = left + 1 + @width + (padding * 2)
    CONTEXT.fillRect(left, top, 1, height)

    return
