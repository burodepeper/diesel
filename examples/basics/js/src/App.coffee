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
      for i in [1 .. 100]
        lightsaber = new Lightsaber()
        lightsaber.setPosition(0, 0)
        lightsaber.setSize(100, 100)
        lightsaber.init()
        @lightsabers.push(lightsaber)

    return
