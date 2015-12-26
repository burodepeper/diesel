class Path extends Pane

  points: []
  lines: []

  addPoint: (point) ->
    @points.push(point)
    if @points.length > 1
      @addLine()
    return

  addLine: ->
    @a = @points[@points.length - 2]
    @b = @points[@points.length - 1]
    line = new Line()
    line.from(@a).to(@b)
    @lines.push(line)
    @addChild(line)
    return
