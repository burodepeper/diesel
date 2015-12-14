
# Engine
# -----------------------------------------------------------------------------
# The global Engine variable is both the container for all entities and a the
# controllers that updates them on every tick. By default, this tick is defined
# by the browser's requestAnimationFrame() method and is limited at 60 fps. All
# entities added to the Engine will have their update() and draw() methods
# invoked on every tick.

Engine =

  entities: []
  context: false
  canvas: false
  now: 0

  # TODO: No idea how to replicate this in CoffeeScript
  isTouchDevice: `'ontouchstart' in document.documentElement`

  init: ->
    @createCanvas()
    if @canvas and @context
      @run()
      @trigger('resize')
      return true
    else
      return false

  # Cycle ---------------------------------------------------------------------

  run: (timeElapsed = 0) ->
    @context.clearRect(0, 0, @canvas.width, @canvas.height)
    @now = new Date().getTime()
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

    @context = @canvas.getContext("2d")
    window.CONTEXT = @context

    # WINDOW is on level 1, otherwise draw() won't be executed
    # window.WINDOW = new Pane(1)
    # window.addEventListener "resize", => @onResize(); return

    return

  onResize: ->
    @width = window.innerWidth
    @height = window.innerHeight
    @columns = Math.ceil(@width / PX)
    @rows = Math.ceil(@height / PX)
    @canvas.setAttribute("width", @width)
    @canvas.setAttribute("height", @height)
    WINDOW.setSize(@columns, @rows)
    return

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
