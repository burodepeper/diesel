class Entity

  _layer: 0
  # state: "idle"
  # nextState: "idle"

  constructor: (layer = 0) ->
    @_layer = layer
    Engine.add(this, @_layer)

  _update: -> return

  _draw: -> return

  # onResize: -> return

  _setId: (@_id) ->

  # setState: (@state, @nextState = "idle") ->

  # listenForResize: ->
  #   window.addEventListener "resize", => @onResize(); return
  #   return

  remove: ->
    Engine.remove(this)
    return
