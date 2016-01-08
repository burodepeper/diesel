layer = 1
LAYER_BACKGROUND = layer++
LAYER_FOREGROUND = layer++

App =
  init: ->
    settings =
      viewport:
        width: 100
        height: 100
        # grid: true

    if Engine.init(settings)

      @lightsabers = []
      for i in [1 .. 5]
        lightsaber = new Lightsaber()
        lightsaber.setPosition(0, 0)
        lightsaber.setSize(WINDOW.getWidth(), WINDOW.getHeight())
        lightsaber.init()
        @lightsabers.push(lightsaber)

      # @colors =
      #   red: new Color('#e10')
      #   orange: new Color('#f80')
      #   yellow: new Color('#fd0')
      #
      # @center = new Particle()
      # @center.setPosition(24, 24)
      # @center.setColor(@colors.red)
      #
      # @circle = new Circle(LAYER_FOREGROUND)
      # @circle.setCenter(@center)
      # @circle.setRadius(5)
      # # @circle.fill(@colors.yellow)
      # @circle.stretch(@colors.yellow)

      # @anotherCircle = new Circle(LAYER_BACKGROUND)
      # @anotherCircle.setCenter(@center)
      # @anotherCircle.setRadius(6)
      # @anotherCircle.outline(@colors.orange)

    return
