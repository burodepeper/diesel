# Constants and globals
PX = 1
CONTEXT = false     # shorthand for Engine.context
WINDOW = false      # fallback reference Pane for particles and panes
NOW = false
DEBUG = false

Engine =

  _entities: []
  _numberOfEntities: 0
  _numberOfEntitiesAdded: 0
  _numberOfEntitiesRemoved: 0
  _numberOfCleanUps: 0

  # {@_capacity} is an array with an assumed length of 60 that holds a representation of processing time (in ms) used over the last 60 frames. One very cycle of {Engine._run()}, the first element is removed, and a new one appended. The method {Engine.getCapacity()} returns a float that represents the accumulative capacity of the last 60 frames.
  _capacity: []

  _context: null
  _canvas: null

  _size:
    width: null
    height: null

  config:
    viewport:
      width: null
      height: null
      grid: false

  # TODO: No idea how to replicate this in CoffeeScript
  isTouchDevice: `'ontouchstart' in document.documentElement`

  init: (settings) ->
    if @_createCanvas()

      # TODO
      # Properly process settings
      if settings.viewport.width
        @config.viewport.width = settings.viewport.width
      if settings.viewport.height
        @config.viewport.height = settings.viewport.height
      if settings.viewport.grid
        @config.viewport.grid = settings.viewport.grid

      # WINDOW is on level 1, otherwise draw() won't be executed
      window.WINDOW = new Pane(1)
      # WINDOW.setColor(new Color('#fff'))
      # WINDOW.color = new Color('#fff')

      # Fill {@_capacity} with empty values
      for i in [1 .. 60]
        @_capacity.push(1)

      @trigger('resize')
      @_run()
      return true
    else
      return false

  # ----- Entities -----

  # Adds an {Entity} to be processed by {Engine}.
  add: (entity, layer = 0) ->
    unless @_entities[layer] then @_entities[layer] = []
    entity._setId(@_entities[layer].length)
    @_entities[layer].push(entity)
    @_numberOfEntitiesAdded++
    return

  # Removes an {Entity} from being processed by {Engine}.
  remove: (entity) ->
    if @_entities[entity._layer]
      if @_entities[entity._layer][entity._id]
        delete @_entities[entity._layer][entity._id]
        @_numberOfEntitiesRemoved++
      else
        console.info "Engine.remove(): entity[#{entity._layer}][#{entity._id}] doesn't exist"
    else
      console.warn "Engine.remove(): layer[#{entity._layer}] doesn't exist"
    return

  # Shorthand for triggering an event
  trigger: (eventType) ->
    window.dispatchEvent(new Event(eventType))
    return

  # ----- Canvas -----

  _run: (timeElapsed = 0) ->
    window.NOW = new Date().getTime()
    Engine._update()
    Engine._draw()
    Engine._check()

    Engine._capacity.shift()
    Engine._capacity.push(new Date().getTime() - NOW)

    window.requestAnimationFrame(Engine._run)
    return

  _check: ->
    # Remove (undefined) entities whenever more than a thousand have accumulated
    if @_numberOfEntitiesRemoved >= 1000
      @cleanUp()
      @_numberOfCleanUps++

  _update: ->
    for entities in @_entities
      if entities
        for entity in entities
          if entity then entity._update(NOW)
    return

  _draw: ->
    @_context.clearRect(0, 0, @_size.width * PX, @_size.height * PX)
    if @config.viewport.grid then @_drawGrid()

    for entities, i in @_entities
      # entities in level 0 are not drawn
      if i and entities
        for entity in entities
          if entity then entity._draw(NOW)
    return

  _drawGrid: ->
    CONTEXT.strokeStyle = 'rgba(255, 255, 255, 0.25)'
    CONTEXT.beginPath()

    top = 0
    bottom = @_size.height * PX
    for x in [1 .. @_size.width - 1]
      left = x * PX
      CONTEXT.moveTo(left, top)
      CONTEXT.lineTo(left, bottom)

    left = 0
    right = @_size.width * PX
    for y in [1 .. @_size.height - 1]
      top = y * PX
      CONTEXT.moveTo(left, top)
      CONTEXT.lineTo(right, top)

    CONTEXT.stroke()
    CONTEXT.closePath()

  _createCanvas: ->

    @_canvas = document.createElement("canvas")
    @_canvas.setAttribute("id", "diesel-canvas")
    document.body.appendChild(@_canvas)

    # Set default CSS on canvas element
    @_canvas.style.position = 'fixed'
    @_canvas.style.top = '50%'
    @_canvas.style.left = '50%'

    @_context = @_canvas.getContext("2d")
    window.CONTEXT = @_context
    window.addEventListener "resize", => @_onResize(); return

    return (@_canvas and @_context)

  _onResize: ->

    @windowWidth = window.innerWidth
    @windowHeight = window.innerHeight
    @windowRatio = @windowWidth / @windowHeight

    if @config.viewport.width and @config.viewport.height

      viewportRatio = @config.viewport.width / @config.viewport.height
      if viewportRatio >= @windowRatio
        px = Math.floor(@windowWidth / @config.viewport.width)
      else
        px = Math.floor(@windowHeight / @config.viewport.height)
      @_size.width = @config.viewport.width
      @_size.height = @config.viewport.height

    else if @config.viewport.width

      px = Math.floor(@windowWidth / @config.viewport.width)
      @_size.width = @config.viewport.width
      @_size.height = Math.floor(@windowHeight / px)

    else if @config.viewport.height

      px = Math.floor(@windowHeight / @config.viewport.height)
      @_size.width = Math.floor(@windowWidth / px)
      @_size.height = @config.viewport.height

    window.PX = px

    @_canvas.setAttribute('width', (@_size.width * px))
    @_canvas.setAttribute('height', (@_size.height * px))
    @_canvas.style.marginLeft = -((@_size.width * px) / 2) + 'px'
    @_canvas.style.marginTop = -((@_size.height * px) / 2) + 'px'

    WINDOW.setSize(@_size.width, @_size.height)

    return

  # ----- Maintenance and debugging -----

  analyze: (focusOn = -1) ->
    inventory = {}
    for layer, i in @_entities
      if (focusOn is i) or focusOn is -1
        for entity in layer
          if entity
            name = entity.constructor.name
          else
            name = '(undefined)'
          unless inventory[name]?
            inventory[name] = 0
          inventory[name]++
    return inventory

  getAllInstancesOf: (name, focusOn = -1) ->
    instances = []
    for layer, i in @_entities
      if (focusOn is i) or focusOn is -1
        for entity in layer
          if entity
            instanceName = entity.constructor.name
            if instanceName is name
              instances.push(entity)
    return instances

  cleanUp: ->
    numberOfEntities = 0
    for layer, i in @_entities
      if layer and layer.length
        cleanedEntities = []
        for entity, j in layer
          if entity
            entity._setId(cleanedEntities.length)
            cleanedEntities.push(entity)
            numberOfEntities++
        @_entities[i] = cleanedEntities
    @_numberOfEntitiesRemoved = 0
    @_numberOfEntities = numberOfEntities
    return

  diagnostics: (verbose = false) ->
    if verbose
      console.log "Engine.diagnostics()"
    totalNumberOfPositions = 0
    totalNumberOfEntities = 0
    for layer, i in @_entities
      numberOfEntitiesOnLayer = 0
      if layer and layer.length
        totalNumberOfPositions += layer.length
        for entity, j in layer
          if entity
            numberOfEntitiesOnLayer++
            totalNumberOfEntities++
        if verbose
          console.log "layer:"+i, "length:"+layer.length, "entities:"+numberOfEntitiesOnLayer

    efficiency = totalNumberOfEntities / totalNumberOfPositions
    if verbose
      console.log "-----"
      console.log totalNumberOfEntities, "on", totalNumberOfPositions, "positions"
      console.log "efficiency:", Math.round(efficiency * 1000) / 10 + "%"
    return efficiency

  # Public: Returns an approximation of the processing capacity used by Engine
  # over the last 60 frames.
  #
  # The `capacity` is ideally between 0 and 1. A value higher than 1 means by
  # definition that the average drawrate was less than 60fps. A value of 0.5
  # means that on average 50% of processing power was used during the last 60
  # frames.
  #
  # The `max` value returned is the maximum duration recorded of a single
  # frame, in ms. A value larger than 16 means a drop below 60fps. A value
  # larger than 33 means a drop below 30fps.
  #
  # Returns an {Object} with these keys:
  #   * `capacity` a {Float}
  #   * `max` an {Integer}
  getCapacity: ->
    sum = 0
    max = 0
    for value in @_capacity
      sum += value
      if value > max then max = value
    return { capacity:sum / 1000, max:max }
