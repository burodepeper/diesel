
class BouncingParticle extends Particle

  setRandomPosition: ->
    x = getRandomInt(0, @reference.getWidth() - 1)
    y = getRandomInt(0, @reference.getHeight() - 1)
    @setPosition(x, y)

  setRandomMomentum: ->
    horizontal = Math.random() - 0.5
    vertical = Math.random() - 0.5
    @addMomentum(horizontal, vertical)

  update: ->
    # TODO add momentum
    # TODO check if particle is within bounds
    super()
