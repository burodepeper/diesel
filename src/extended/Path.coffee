class Path extends Pane

  points: []
  lines: []

  addPoint: (point) ->
    point = isPoint(point)
    if point
      @points.push(point)
      if @points.length > 1
        @addLine()
      return true
    else
      console.warn "Path.addPoint()", point, "is not valid"
      return false

  addLine: ->
    @a = @points[@points.length - 2]
    @b = @points[@points.length - 1]
    line = new Line()
    line.from(@a).to(@b)
    @lines.push(line)
    @addChild(line)
    return
