
# Pane
# -----------------------------------------------------------------------------
# A pane is a representation of an area, and of possible entities grouped
# within that area. The Pane itself is not visible.

class Pane extends Entity

  constructor: ->
    super()
    @reference = WINDOW
    @position =
      absolute:
        x: 0
        y: 0
      relative:
        x: 0
        y: 0
    @size =
      width: 0
      height: 0
      surface: 0
      circumference: 0
    @opacity = 1
    @children = []
    @css =
      top: null
      right: null
      bottom: null
      left: null
      width: null
      height: null

    @isVisible = true
    @hasCSS = false

  # Setters -------------------------------------------------------------------

  setPosition: (x, y) ->
    @position.relative.x = x
    @position.relative.y = y
    return

  setSize: (width, height) ->
    @size.width = width
    @size.height = height
    if (width and height)
      @size.surface = width * height
      @size.circumference = (2 * width) + (2 * height)
    else
      if width
        @size.surface = width
        @size.circumference = width * 2
        @size.height = 0
      else
        @size.surface = height
        @size.circumference = height * 2
        @size.width = 0
    return

  setCSS: (properties) ->
    for name, value of properties
      @setCSSProperty(name, value)
    @hasCSS = true
    return

  setCSSProperty: (name, value) ->
    unless ((name is 'top') or (name is 'left')) and value is 'center'
      value = parseInt(value)
    @css[name] = value
    return

  setOpacity: (@opacity) ->

  setReference: (@reference) ->

  # Helpers -------------------------------------------------------------------

  getWidth: ->
    return @size.width

  getHeight: ->
    return @size.height

  # Updates -------------------------------------------------------------------

  onResize: ->
    if @hasCSS
      {x, y} = @position.relative
      {width, height} = @size

      if @css.width then width = @css.width
      if @css.height then height = @css.height

      # Horizontal positioning
      if @css.left? and @css.right?
        width = @reference.getWidth() - @css.left - @css.right
        x = @css.left
      else if (@css.left is 'center') and width
        x = Math.floor((@reference.getWidth() - width) / 2)
      else if @css.left?
        x = @css.left
      else if @css.right? and width
        x = @reference.getWidth() - width - @css.right
      else
        console.warn "Pane.onResize()", this, "invalid horizontal positioning"

      # Vertical positioning
      if @css.top? and @css.bottom?
        height = @reference.getHeight() - @css.top - @css.bottom
        y = @css.top
      else if (@css.top is 'center') and height
        y = Math.floor((@reference.getHeight() - height) / 2)
      else if @css.top?
        y = @css.top
      else if @css.bottom? and height
        y = @reference.getHeight() - height - @css.bottom
      else
        console.warn "Pane.onResize()", this, "invalid vertical positioning"

      @setPosition(x, y)
      @setSize(width, height)

  # Children ------------------------------------------------------------------
