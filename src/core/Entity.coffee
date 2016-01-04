class Entity

  _layer: 0
  # state: "idle"
  # nextState: "idle"

  constructor: (layer = 0) ->
    @_layer = layer
    Engine.addEntity(this, @_layer)

  update: -> return

  draw: -> return

  # onResize: -> return

  setId: (@_id) ->

  # setState: (@state, @nextState = "idle") ->

  # listenForResize: ->
  #   window.addEventListener "resize", => @onResize(); return
  #   return

  remove: ->
    Engine.removeEntity(this)
    return
