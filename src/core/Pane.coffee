# Pane
# ----
# A pane is a representation of an area, and of possible entities grouped within that area. The Pane itself is not visible.

class Pane extends Entity

  constructor: (@_layer = 0) ->
    super()

    @reference = WINDOW
    @children = []

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

    @css =
      top: null
      right: null
      bottom: null
      left: null
      width: null
      height: null

    @color = new Color()
    @opacity = 1
    @isVisible = true
    @hasCSS = false
    @hasBoundingBox = false
    @boundingBox = null
    @hasChanged = false

  # Setters -------------------------------------------------------------------

  # TODO
  # Check validaty of x and y
  setPosition: (x, y) ->
    @position.relative.x = x
    @position.relative.y = y
    return

  # TODO
  # Check validaty of width and height
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
    @onResize()
    return

  setCSSProperty: (key, value) ->
    validKeys = ['top', 'right', 'bottom', 'left', 'width', 'height']
    if validKeys.indexOf(key) isnt -1
      unless ((key is 'top') or (key is 'left')) and value is 'center'
        value = parseInt(value)
      @css[key] = value
    return

  setOpacity: (opacity = 1) ->
    opacity = parseFloat(opacity)
    if opacity is NaN then opacity = 1
    if opacity < 0 then opacity = 0
    if opacity > 1 then opacity = 1
    @opacity = opacity
    return

  setReference: (@reference, @_childID) ->

  setColor: (color) ->
    if typeof color is 'object'
      @color = color
    else
      @color.set(color)
    @color.setReference(this)
    @updateChildren('setColor', @color)

  # Helpers -------------------------------------------------------------------

  getWidth: ->
    return @size.width

  getHeight: ->
    return @size.height

  getX: ->
    if @reference
      return @reference.getX() + @position.relative.x
    else
      return @position.relative.x

  getY: ->
    if @reference
      return @reference.getY() + @position.relative.y
    else
      return @position.relative.y

  getOpacity: ->
    return @opacity

  getCenter: ->
    @center =
      x: (@size.width - 1) / 2
      y: (@size.height - 1) / 2
    return @center

  getColor: ->
    return @color

  isWithinBounds: (x = @position.relative.x, y = @position.relative.y, width = @getWidth(), height = @getHeight()) ->
    if @reference
      if (x >= 0) and (y >= 0)
        if (x + width <= @reference.getWidth()) and (y + height <= @reference.getHeight())
          return true
      return false

  # Updates -------------------------------------------------------------------

  onResize: ->
    if @hasCSS
      {x, y} = @position.relative
      {width, height} = @size

      if @css.width then width = @css.width
      if @css.height then height = @css.height

      # Horizontal positioning
      if (@css.left is 'center') and width
        x = Math.floor((@reference.getWidth() - width) / 2)
      else if @css.left? and @css.right?
        width = @reference.getWidth() - @css.left - @css.right
        x = @css.left
      else if @css.left?
        x = @css.left
      else if @css.right? and width
        x = @reference.getWidth() - width - @css.right
      else
        console.warn "Pane.onResize()", this, "invalid horizontal positioning"

      # Vertical positioning
      if (@css.top is 'center') and height
        y = Math.floor((@reference.getHeight() - height) / 2)
      else if @css.top? and @css.bottom?
        height = @reference.getHeight() - @css.top - @css.bottom
        y = @css.top
      else if @css.top?
        y = @css.top
      else if @css.bottom? and height
        y = @reference.getHeight() - height - @css.bottom
      else
        console.warn "Pane.onResize()", this, "invalid vertical positioning"

      @setPosition(x, y)
      @setSize(width, height)

  # Children ------------------------------------------------------------------

  # TODO
  # Check if {child} is a valid Entity
  addChild: (child) ->
    @children.push(child)
    child.setReference this, @children.length - 1
    child.isVisible = @isVisible
    child.color = @color
    return

  updateChildren: (method, value) ->
    for child in @children
      child[method](value)
    return

  getChild: (i) ->
    if @children[i]
      return @children[i].show()
    else
      particle = new Particle(@_layer)
      @addChild(particle)
      return particle

  # Debug ---------------------------------------------------------------------

  enableBoundingBox: (color) ->
    @hasBoundingBox = true
    @boundingBox = new BoundingBox()
    @boundingBox.setColor(color)
    @addChild(@boundingBox)

  # NOTE untested
  disableBoundingBox: ->
    @hasBoundingBox = false
    if @boundingBox
      @boundingBox.remove()
      @boundingBox = false
