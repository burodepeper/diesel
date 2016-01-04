class Star extends Pane

  constructor: (@_layer) ->
    super(@_layer)
    @x = null
    @y = null
    @z = null

  # Calculates {@x} and {@y} given a distance {@z} and a {range} for a line upon which {@x} and {@y} can be found. This line is based on a random angle, and a random length with a maximum of the range of our radar.
  init: (@z, @range) ->
    @angle = getRandomInt(0, 359)
    @radians = @angle * (Math.PI / 180)
    @passingDistance = getRandomInt(1, @range)
    @x = Math.sin(@radians) * @passingDistance
    @y = Math.cos(@radians) * @passingDistance

    @particle = new Particle(LAYER_STARS)
    @addParticle(@particle)
    @particle.setColor(new Color('#fff'))

    # TODO
    # Add a label to a star if {@passingDistance} is smaller than a tenth of our range.
    if @passingDistance < (@range * 0.1)
      @addLabel()

  addLabel: ->
    @label = new StarLabel(this)

  # Transforms the 3d-coordinates we have onto a 2d plane. And decreases the distance, the {@z} coordinate when done with the fixed 'speed' of our spaceship.
  update: ->
    # Calculate the distance in 3d between (0, 0, 0) and (@x, @y, @z)
    s = Math.sqrt((@x * @x) + (@z * @z))
    distance = Math.sqrt((s * s) + (@y * @y))
    opacity = (@range - distance) / @range

    # Adding {@passingDistance} has the {Star} move to the edge of the radar. The opacity is still based on the actual distance, so nearer stars are brighter.
    length = ((@range - distance + @passingDistance) / @range) * 80

    x = 80 + Math.sin(@radians) * length
    y = 80 + Math.cos(@radians) * length
    @setPosition(x, y)
    @particle.setOpacity(opacity)
    # @particle.setPosition(x, y)
    # @particle.setPosition(0, 0)

    @z -= 1

    # TODO remove {Star} when it is outside of negative range of the {Radar}
    if @z <= 0
      @remove()
      App.stars.createStar()

    super()

  remove: ->
    if @label then @label.remove()
    @particle.remove()
    super()
