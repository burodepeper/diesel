class Pane extends Point

  constructor: (@_layer = 1, x = 0, y = 0) ->
    super(x, y, @_layer)

    @_position = null
    @_size =
      width: 0
      height: 0
      surface: 0
      circumference: 0

    # @_color = new Color()
    @_reference = WINDOW

    @_children = []
    @_particles = []

    @_css =
      top: null
      right: null
      bottom: null
      left: null
      width: null
      height: null

    @_isVisible = true
    # @_hasCSS = false
    # @hasBoundingBox = false
    # @boundingBox = null
    # @hasChanged = false

    # @setPosition(x, y)

  # ----- Setters -----

  # TODO Check validaty of width and height
  setSize: (width, height) ->
    @_size.width = width
    @_size.height = height
    if (width and height)
      @_size.surface = width * height
      @_size.circumference = (2 * width) + (2 * height)
    else
      if width
        @_size.surface = width
        @_size.circumference = width * 2
        @_size.height = 0
      else
        @_size.surface = height
        @_size.circumference = height * 2
        @_size.width = 0
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

  # setOpacity: (opacity = 1) ->
  #   if @color
  #     opacity = parseFloat(opacity)
  #     if opacity is NaN then opacity = 1
  #     if opacity < 0 then opacity = 0
  #     if opacity > 1 then opacity = 1
  #     @color.setOpacity(opacity)
  #     @updateParticles('setColor', @color)
  #   return

  # setReference: (@reference, @_childID) ->

  # setColor: (color, opacity = null) ->
  #   if typeof color is 'object'
  #     @color = color
  #   else
  #     @color.set(color)
  #   if opacity? then @color.setOpacity(opacity)
  #   @color.setReference(this)
  #   @updateParticles('setColor', @color)

  # Helpers -------------------------------------------------------------------

  getWidth: ->
    return @_size.width

  getHeight: ->
    return @_size.height

  # getX: ->
  #   if @reference
  #     return @reference.getX() + @position.relative.x
  #   else
  #     return @position.relative.x
  #
  # getY: ->
  #   if @reference
  #     return @reference.getY() + @position.relative.y
  #   else
  #     return @position.relative.y

  # getCenter: ->
  #   @center =
  #     x: (@size.width - 1) / 2
  #     y: (@size.height - 1) / 2
  #   return @center

  # getColor: ->
  #   return @color

  # isWithinBounds: (x = @position.relative.x, y = @position.relative.y, width = @getWidth(), height = @getHeight()) ->
  #   if @reference
  #     if (x >= 0) and (y >= 0)
  #       if (x + width <= @reference.getWidth()) and (y + height <= @reference.getHeight())
  #         return true
  #     return false

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

  # ----- Children -----

  # TODO
  # Check if {child} is a valid Entity
  addChild: (child) ->
    @children.push(child)
    child._setReference(this, (@children.length + @particles.length - 1))
    # child.isVisible = @isVisible
    # child.isVisible = true
    return

  # updateChildren: (method, value) ->
  #   for child in @children
  #     child[method](value)
  #   return

  # getChild: (i) ->
  #   if @children[i]
  #     return @children[i]
  #   else
  #     particle = new Particle(@_layer)
  #     @addChild(particle)
  #     return particle

  # ----- Particles -----

  addParticle: (particle) ->
    @_particles.push(particle)
    particle._setReference(this, (@_particles.length + @_children.length - 1))
    # particle.isVisible = @isVisible
    particle.color = @color
    return

  updateParticles: (method, value) ->
    for particle in @particles
      particle[method](value)
    return

  getParticle: (i) ->
    if @_particles[i]
      return @_particles[i]
    else
      particle = new Particle(@_layer)
      @addParticle(particle)
      return particle

  # ----- Debug -----

  # enableBoundingBox: (color = '#fff') ->
  #   @hasBoundingBox = true
  #   @boundingBox = new BoundingBox()
  #   @boundingBox.setColor(color)
  #   @addChild(@boundingBox)

  # NOTE untested
  # disableBoundingBox: ->
  #   @hasBoundingBox = false
  #   if @boundingBox
  #     @boundingBox.remove()
  #     @boundingBox = false

  # remove: ->
  #   for particle in @particles
  #     particle.remove()
  #   for child in @children
  #     child.remove()
  #   super()
