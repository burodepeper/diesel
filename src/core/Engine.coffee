
# Constants and globals
PX = 6              # Particle size, 6 is nice
CONTEXT = false     # shorthand for Engine.context
WINDOW = false      # fallback reference Pane for particles and panes
NOW = false
DEBUG = false

# Engine
# -----------------------------------------------------------------------------
# The global Engine variable is both the container for all entities and the
# controller that updates them on every tick. By default, this tick is defined
# by the browser's requestAnimationFrame() method and is limited at 60 fps. All
# entities added to the Engine will have their update() and draw() methods
# invoked on every tick.

Engine =

  config:
    viewport: {}
  entities: []
  context: false
  canvas: false
  now: 0
  px: 1

  # TODO: No idea how to replicate this in CoffeeScript
  isTouchDevice: `'ontouchstart' in document.documentElement`

  init: (settings) ->
    if @createCanvas()

      # TODO
      # Properly process settings
      if settings.viewport.width
        @config.viewport.width = settings.viewport.width
      if settings.viewport.height
        @config.viewport.height = settings.viewport.height

      # WINDOW is on level 1, otherwise draw() won't be executed
      # window.WINDOW = new Pane(1)

      @trigger('resize')
      @run()

  # Cycle ---------------------------------------------------------------------

  run: (timeElapsed = 0) ->
    @now = new Date().getTime()
    window.NOW = @now
    Engine.update()
    Engine.draw()
    window.requestAnimationFrame(Engine.run)
    return

  update: ->
    for entities in @entities
      if entities
        for entity in entities
          if entity then entity.update(@now)
    return

  draw: ->
    @context.clearRect(0, 0, @width, @height)
    for entities, i in @entities
      # entities in level 0 are not drawn
      if i and entities
        for entity in entities
          if entity then entity.draw(@now)
    return

  # Entities ------------------------------------------------------------------

  addEntity: (entity, layer = 0) ->
    unless @entities[layer] then @entities[layer] = []
    entity.setEntityID(@entities[layer].length)
    @entities[layer].push(entity)
    return

  removeEntity: (entity) ->
    if @entities[entity._layer]
      if @entities[entity._layer][entity._entityID]
        delete @entities[entity._layer][entity._entityID]
    return

  # Canvas --------------------------------------------------------------------

  createCanvas: ->

    @canvas = document.createElement("canvas")
    @canvas.setAttribute("id", "diesel-canvas")
    document.body.appendChild(@canvas)

    # Set default CSS on canvas element
    @canvas.style.position = 'fixed'
    @canvas.style.top = '50%'
    @canvas.style.left = '50%'

    @context = @canvas.getContext("2d")
    window.CONTEXT = @context
    # window.WINDOW = new Pane(1)
    window.addEventListener "resize", => @onResize(); return

    return (@canvas and @context)

  onResize: ->

    @windowWidth = window.innerWidth
    @windowHeight = window.innerHeight
    @windowRatio = @windowWidth / @windowHeight

    if @config.viewport.width and @config.viewport.height
      viewportRatio = @config.viewport.width / @config.viewport.height
      if viewportRatio >= @windowRatio
        @px = Math.floor(@windowWidth / @config.viewport.width)
      else
        @px = Math.floor(@windowHeight / @config.viewport.height)
      @width = @config.viewport.width * @px
      @height = @config.viewport.height * @px

    window.PX = @px

    @canvas.setAttribute('width', @width)
    @canvas.setAttribute('height', @height)
    @canvas.style.marginLeft = -(@width / 2) + 'px'
    @canvas.style.marginTop = -(@height / 2) + 'px'

    return

  # Support -------------------------------------------------------------------

  trigger: (eventType) ->
    window.dispatchEvent(new Event(eventType))
    return

  # Maintenance ---------------------------------------------------------------

  cleanUp: ->
    for layer, i in @entities
      if layer and layer.length
        cleanedEntities = []
        for entity, j in layer
          if entity
            entity.setEntityID(cleanedEntities.length)
            cleanedEntities.push(entity)
        @entities[i] = cleanedEntities
    return

  diagnostics: (verbose = false) ->
    if verbose
      console.log "Engine.diagnostics()"
    totalNumberOfPositions = 0
    totalNumberOfEntities = 0
    for layer, i in @entities
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
