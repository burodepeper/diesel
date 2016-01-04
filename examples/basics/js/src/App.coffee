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

      delay 500, =>
        @left.moveTo(74, 49, 3500, 'ease-in-out')
      delay 1500, =>
        @right.moveTo(24, 24, 2500, 'ease-in-out')

      # @particle = new Particle(LAYER_FOREGROUND, 2, 2)

    return
