App =

  init: ->

    settings =
      viewport:
        width: 120
        height: 90

    if Engine.init(settings)

      @left = new Point(1, 1)
      @right = new Point(118, 1)

      @line = new Line()
      @line.from(@left).to(@right)

      @left.moveTo(1, 88, 2000)
      delay 2000, => @left.moveTo(1, 44, 2000)
      delay 4000, => @left.moveTo(1, 88, 2000)
      @right.moveTo(118, 88, 6000)

    return
