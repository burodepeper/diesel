
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

  # Setters -------------------------------------------------------------------

  setPosition: (x, y) ->
    @position.relative.x = x
    @position.relative.y = y
    return

  setSize: (width, height) ->
    @size.width = width
    @size.height = height
    @size.surface = width * height
    @size.circumference = (2 * width) + (2 * height)
    return

  setCSS: (properties) ->
    for name, value in properties
      @setCSSProperty(name, value)
    return

  setCSSProperty: (name, value) ->
    @css[name] = value
    return

  setOpacity: (@opacity) ->

  setReference: (@reference) ->

  # Updates -------------------------------------------------------------------

  # Children ------------------------------------------------------------------
