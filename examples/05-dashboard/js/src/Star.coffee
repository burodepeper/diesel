class Star extends Particle

  constructor: (@_layer) ->
    super(@_layer)
    @x = null
    @y = null
    @z = null

  # Calculates {@x} and {@y} given a distance {@z} and a {range} for a line upon which {@x} and {@y} can be found. This line is based on a random angle, and a random length with a maximum of the range of our radar.
  init: (@z, @range) ->
    @angle = getRandomInt(0, 359)
    @radians = @angle * (Math.PI / 180)
    length = getRandomInt(1, @range)
    @x = Math.sin(@radians) * length
    @y = Math.cos(@radians) * length

  # Transforms the 3d-coordinates we have onto a 2d plane. And decreases the distance, the {@z} coordinate when done with the fixed 'speed' of our spaceship.
  update: ->
    # Calculate the distance in 3d between (0, 0, 0) and (@x, @y, @z)
    s = Math.sqrt((@x * @x) + (@z * @z))
    distance = Math.sqrt((s * s) + (@y * @y))
    length = ((@range - distance) / @range) * 80

    x = 80 + Math.sin(@radians) * length
    y = 80 + Math.cos(@radians) * length
    @setPosition(x, y)
    @setOpacity((@range - distance) / @range)

    @z -= 10

    # TODO remove {Star} when it is outside of negative range of the {Radar}
    if @z <= 0
      @remove()
      App.stars.createStar()

    super()
