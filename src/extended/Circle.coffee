class Circle extends Pane

  radius: null
  center: null

  constructor: (@_layer = 1) ->
    super(@_layer)

  setCenter: (@center) ->

  setRadius: (@radius) ->

  update: ->

    if @center and @radius
      i = 0
      for angle in [0 .. 359]
        radians = angle * (Math.PI / 180)
        x = @center.x + (Math.cos(radians) * @radius)
        y = @center.y - (Math.sin(radians) * @radius)
        particle = @getParticle(i)
        particle.setPosition(x, y)
        particle.show()
        i++

  getParticle: (i) ->
    if @children[i]
      return @children[i].show()
    else
      particle = new Particle(@_layer)
      @addChild(particle)
      return particle
