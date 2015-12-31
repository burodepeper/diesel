class Star extends Particle

  constructor: ->
    super()

  update: ->
    if @position.relative
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
    @color.setOpacity(@speed)
    return
