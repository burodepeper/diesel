class Pane extends VisualEntity

  constructor: (@_layer = 1, x = 0, y = 0) ->
    super(x, y, @_layer)

    @_position = null
    @_dimensions =
      width: 0
      height: 0
      surface: 0
      circumference: 0
      center:
        x: 0
        y: 0

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

    @_init()

  # ----- Setters -----

  # TODO Check validaty of width and height
  setSize: (width, height) ->
    @_dimensions.width = width
    @_dimensions.height = height
    @_updateDimensions()
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

  # ----- Getters -----

  getWidth: -> return @_dimensions.width

  getHeight: -> return @_dimensions.height

  getCenter: -> return @_dimensions.center

  getSurface: -> return @_dimensions.surface

  getCircumference: -> return @_dimensions.circumference

  getColor: -> return @_color

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

  # TODO Check if {child} is a valid Entity
  addChild: (child) ->
    @children.push(child)
    child._setReference(this, (@children.length + @particles.length - 1))
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

  # ----- Private methods -----

  _updateDimensions: ->
    width = @_dimensions.width
    height = @_dimensions.height
    if (width and height)
      @_dimensions.surface = width * height
      @_dimensions.circumference = (2 * width) + (2 * height)
    else
      if width
        @_dimensions.surface = width
        @_dimensions.circumference = width * 2
        @_dimensions.height = 1
      else
        @_dimensions.surface = height
        @_dimensions.circumference = height * 2
        @_dimensions.width = 1
    @_dimensions.center =
      x: (@_dimensions.width - 1) / 2
      y: (@_dimensions.height - 1) / 2
    return
