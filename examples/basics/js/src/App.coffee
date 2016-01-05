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

      @yellow = new Color('#fd0')

      @left = new Point(1, 1)
      @right = new Point(98, 1)
      @line = new Line(LAYER_FOREGROUND)
      @line.setColor(@yellow)
      @line.from(@left).to(@right)

      @left.moveTo(74, 49, 3500, 'ease-in-out')
      delay 1500, => @right.moveTo(24, 24, 2500, 'ease-in-out')
      delay 500, => @yellow.change('#e10', 1, 2500)

    return
