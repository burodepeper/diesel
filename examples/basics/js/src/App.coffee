layer = 1
LAYER_BACKGROUND = layer++
LAYER_FOREGROUND = layer++

App =
  init: ->
    settings =
      viewport:
        width: 100
        height: 100

    if Engine.init(settings)

      @lightsabers = []
      for i in [1 .. 5]
        lightsaber = new Lightsaber()
        lightsaber.setPosition(0, 0)
        lightsaber.setSize(WINDOW.getWidth(), WINDOW.getHeight())
        lightsaber.init()
        @lightsabers.push(lightsaber)

      # @circle = new Circle(LAYER_BACKGROUND)
      # @circle.setCenter(new Point(5, 5))
      # @circle.setRadius(5)
      # @circle.outline('#fd0')
      # @circle.fill(new Color('#e10'))

    return
