class SpectrumAnalyzer extends Controller

  counter: 0
  points: []
  min: 0
  max: 42

  constructor: ->
    super()

    @pane = new Pane()
    @pane.setCSS({ left:1, right:1, bottom:1, height:43 })
    @width = @pane.getWidth()
    @height = @pane.getHeight()

    # TODO
    # Decorate the pane
    # - Dark gray background
    # - Less dark gray line at vertical center
    # line = new Line()
    # @pane.addChild(line)
    # line.from(new Point(0, (@height - 1) / 2)).to(new Point(@width - 1, (@height - 1) / 2))

    numberOfPoints = Math.ceil(@width / 21)
    increment = @width / (numberOfPoints - 1)
    @path = new Path()
    @pane.addChild(@path)
    x = 0
    center = 21

    for i in [0 .. numberOfPoints - 1]
      y = center + Math.floor(10 - Math.random() * 20)
      point = new Point(x, y)
      @path.addPoint(point)
      x += increment
      @points.push(point)

  update: ->

    # Shift point.y one place horizontally at 6 fps
    # and generate a new y for the last one
    # if (@counter % 10) is 1
    #   for i in [@points.length - 1 .. 0]
    #     point = @points[i]
    #     if i
    #       point.y = @points[i - 1].y
    #     else
    #       point.y = 21 + Math.floor(10 - Math.random() * 20)
    # @counter++

    # Randomly change point.y at 30 fps
    if (@counter % 2) is 1
      for point in @points
        y = point.y
        r = getRandomInt(@min, @max)
        if r < y
          point.y -= 1
        else if r > y
          point.y += 1
    @counter++
