class Star extends Particle

  randomize: ->
    @angle = getRandomInt(0, 359)
    @distance = getRandomInt(0, 9999)
    # @distance = 10000
    @radians = @angle * (Math.PI / 180)

  setOrigin: (@origin) ->

  update: ->
    # TODO calculate x and y based on @angle and @distance

    x = Math.sin(@radians) * (10000 - @distance)
    y = Math.cos(@radians) * (10000 - @distance)
    distance = Math.sqrt((x * x) + (y * y))
    opacity = 1 - ((10000 - distance) / 10000)
    offset = (10000 - distance) / 10000

    x = @origin.x + (Math.sin(@radians) * offset * 160)
    y = @origin.y + (Math.cos(@radians) * offset * 160)
    # console.log @distance, x, y
    @setPosition(x, y)
    @setOpacity(opacity)

    @distance -= 10

    super()
