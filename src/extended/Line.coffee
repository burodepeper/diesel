class Line extends Entity

  from: null
  to: null
  length: 0
  pane: null

  constructor: (layer = 1) ->
    super()
    @pane = new Pane(layer)

  setFrom: (@from) ->
    @updatePane()
    return

  setTo: (@to) ->
    @updatePane()
    return

  updatePane: ->
    if @from? and @to? and @pane?
      console.log "Something else"

  calculateLength: ->
    if @from? and @to?
      console.log "Something"
