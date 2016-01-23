class Pane extends VisualEntity

  constructor: (@_layer = 1, x = 0, y = 0) ->
    super(x, y, @_layer)

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
      @_css[key] = value
    return

  # ----- Getters -----

  getWidth: -> return @_dimensions.width

  getHeight: -> return @_dimensions.height

  getCenter: -> return @_dimensions.center

  getSurface: -> return @_dimensions.surface

  getCircumference: -> return @_dimensions.circumference

  getColor: -> return @_color

  # isWithinBounds: (x = @position.relative.x, y = @position.relative.y, width = @getWidth(), height = @getHeight()) ->
  #   if @_reference
  #     if (x >= 0) and (y >= 0)
  #       if (x + width <= @_reference.getWidth()) and (y + height <= @_reference.getHeight())
  #         return true
  #     return false

  # Updates -------------------------------------------------------------------

  onResize: ->
    if @hasCSS
      # {x, y} = @position.relative
      x = @getX()
      y = @getY()
      {width, height} = @_dimensions

      if @_css.width then width = @_css.width
      if @_css.height then height = @_css.height

      # Horizontal positioning
      if (@_css.left is 'center') and width
        x = Math.floor((@_reference.getWidth() - width) / 2)
      else if @_css.left? and @_css.right?
        width = @_reference.getWidth() - @_css.left - @_css.right
        x = @_css.left
      else if @_css.left?
        x = @_css.left
      else if @_css.right? and width
        x = @_reference.getWidth() - width - @_css.right
      else
        console.warn "Pane.onResize()", this, "invalid horizontal positioning"

      # Vertical positioning
      if (@_css.top is 'center') and height
        y = Math.floor((@_reference.getHeight() - height) / 2)
      else if @_css.top? and @_css.bottom?
        height = @_reference.getHeight() - @_css.top - @_css.bottom
        y = @_css.top
      else if @_css.top?
        y = @_css.top
      else if @_css.bottom? and height
        y = @_reference.getHeight() - height - @_css.bottom
      else
        console.warn "Pane.onResize()", this, "invalid vertical positioning"

      @setPosition(x, y)
      @setSize(width, height)

  # ----- Children -----

  _getNextId: ->
    if @_particles.length and @_children.length
      id = @_particles.length + @_children.length - 1
    else if @_particles.length or @_children.length
      id = @_particles.length + @_children.length
    else
      id = 0
    return id

  # TODO Check if {child} is a valid Entity
  addChild: (child) ->
    @_children.push(child)
    # id = @_getNextId()
    # child._setReference(this, id)
    child._setReference(this)
    return

  getChild: (num) ->
    if @_children[num]?
      return @_children[num]
    else
      return false

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
    # id = @_getNextId()
    # particle._setReference(this, id)
    particle._setReference(this)
    return

  updateParticles: (method, value) ->
    for particle in @_particles
      particle[method](value)
    return

  getParticle: (i) ->
    if @_particles[i]
      return @_particles[i]
    else
      particle = new Particle(@_layer)
      @addParticle(particle)
      return particle

  remove: ->
    if @_particles.length
      for particle in @_particles
        particle.remove()
    if @_children.length
      for child in @_children
        child.remove()
    super()

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
