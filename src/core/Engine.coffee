# Constants and globals
PX = 1
CONTEXT = false     # shorthand for Engine.context
WINDOW = false      # fallback reference Pane for particles and panes
NOW = false
DEBUG = false

Engine =

  _entities: []
  _context: null
  _canvas: null
  _size:
    width: null
    height: null

  config:
    viewport:
      width: null
      height: null

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

      # WINDOW is on level 1, otherwise draw() won't be executed
      window.WINDOW = new Pane(1)

      @trigger('resize')
      @_run()
      return true
    else
      return false

  # Cycle ---------------------------------------------------------------------

  _run: (timeElapsed = 0) ->
    window.NOW = new Date().getTime()
    Engine._update()
    Engine._draw()
    window.requestAnimationFrame(Engine._run)
    return

  _update: ->
    for entities in @_entities
      if entities
        for entity in entities
          if entity then entity._update(NOW)
    return

  _draw: ->
    @_context.clearRect(0, 0, @_size.width * PX, @_size.height * PX)
    for entities, i in @_entities
      # entities in level 0 are not drawn
      if i and entities
        for entity in entities
          if entity then entity._draw(NOW)
    return

  # ----- Entities -----

  add: (entity, layer = 0) ->
    unless @_entities[layer] then @_entities[layer] = []
    entity._setId(@_entities[layer].length)
    @_entities[layer].push(entity)
    return

  remove: (entity) ->
    if @_entities[entity._layer]
      if @_entities[entity._layer][entity._id]
        delete @_entities[entity._layer][entity._id]
      else
        console.info "Engine.remove(): entity[#{entity._layer}][#{entity._id}] doesn't exist"
    else
      console.warn "Engine.remove(): layer[#{entity._layer}] doesn't exist"
    return

  # ----- Canvas -----

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

  # ----- Support -----

  trigger: (eventType) ->
    window.dispatchEvent(new Event(eventType))
    return

  getWidth: -> return @_size.width

  getHeight: -> return @_size.height

  # ----- Maintenance -----

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
    for layer, i in @_entities
      if layer and layer.length
        cleanedEntities = []
        for entity, j in layer
          if entity
            entity._setId(cleanedEntities.length)
            cleanedEntities.push(entity)
        @_entities[i] = cleanedEntities
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
