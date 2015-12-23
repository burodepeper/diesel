
class BouncingParticle extends Particle

  momentum:
    horizontal: 0
    vertical: 0

  setRandomPosition: ->
    x = getRandomInt(0, @reference.getWidth() - 1)
    y = getRandomInt(0, @reference.getHeight() - 1)
    @setPosition(x, y)

  setRandomMomentum: ->
    horizontal = Math.random() - 0.5
    vertical = Math.random() - 0.5
    @addMomentum(horizontal, vertical)

  addMomentum: (horizontal, vertical) ->
    @momentum = {horizontal, vertical}
    return

  update: ->
    # add momentum and check if particle is within bounds,
    # otherwise calculate new position and reverse momentum
    newX = @position.relative.x + @momentum.horizontal
    newY = @position.relative.y + @momentum.vertical

    if @isWithinHorizontalBounds(newX)
      x = newX
    else
      x = @position.relative.x
      @momentum.horizontal = 0 - @momentum.horizontal

    if @isWithinVerticalBounds(newY)
      y = newY
    else
      y = @position.relative.y
      @momentum.vertical = 0 - @momentum.vertical

    @setPosition(x, y)
    super()
