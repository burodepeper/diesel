class Point extends Entity

  x: null
  y: null

  constructor: (@x, @y) ->
    super(0)

  moveTo: (x, y, duration, easing = 'ease-in-out') ->

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
