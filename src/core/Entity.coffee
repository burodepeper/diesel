# Entity
# ------
# An entity is the grandparent of anything that exists in the Engine's cycle. It is merely an abstract form of a 'thing' and its methods only have to do with its existence.

class Entity

  _layer: 0
  state: "idle"
  nextState: "idle"

  constructor: ->
    Engine.addEntity(this, @_layer)

  update: -> return

  draw: -> return

  # onResize: -> return

  setEntityID: (@_entityID) ->

  setState: (@state, @nextState = "idle") ->

  # listenForResize: ->
  #   window.addEventListener "resize", => @onResize(); return
  #   return

  remove: ->
    Engine.removeEntity(this)
    return
