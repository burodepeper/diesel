class Star extends Particle

  update: ->
    x = @getX()
    if x < 0
      @randomize()
      x = WINDOW.getWidth()
    else
      x = x - @speed
    @setPosition(x, @getY())
    super()

  randomize: ->
    @speed = Math.random()
    @setOpacity(@speed)
    return
