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

      @controller = new Controller()

    return
