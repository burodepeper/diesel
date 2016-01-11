class Path extends Pane

  _points: []
  _lines: []

  # _isClosed: false

  addPoint: (point) ->
    point = isPoint(point)
    if point
      @_points.push(point)
      if @_points.length > 1
        @_addLine()
      return true
    else
      console.warn "Path.addPoint()", point, "is not valid"
      return false

  # stroke: ->

  _addLine: ->
    @a = @_points[@_points.length - 2]
    @b = @_points[@_points.length - 1]
    line = new Line()
    line.from(@a).to(@b)
    @_lines.push(line)
    @addChild(line)
    return
