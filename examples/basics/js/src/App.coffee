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

      @left = new Point(1, 1)
      @right = new Point(98, 1)
      @line = new Line(LAYER_FOREGROUND)
      @line.from(@left).to(@right)

      # @particle = new Particle(LAYER_FOREGROUND, 2, 2)

    return
