class Point extends Entity

  x: null
  y: null

  constructor: (x = 0, y = 0) ->
    if x is NaN or y is NaN
      console.log "Point()", x+","+y, "is not a valid Point"
      return false
    else
      @x = x
      @y = y
    super(0)

  moveTo: (x, y, duration = 1000, easing = 'ease-in-out') ->

    parameters = []
    parameters.push({ name:'x', from:@x, to:x })
    parameters.push({ name:'y', from:@y, to:y })
    @tween = new Tween(parameters, duration, easing)

    @setState('tween', 'idle')

  update: ->

    switch @state
      when 'tween'
        @x = Math.round(@tween.getValue('x'))
        @y = Math.round(@tween.getValue('y'))
        if @tween.isComplete
          @setState(@nextState)

    return
