class Polygon extends Path
  constructor: ->
    super()

    _numberOfSides: null
    _center: null
    _innerRadius: null
    _outerRadius: null
    _rotation: null

  setCenter: (center) ->
    if isPoint(center)
      @_center = center
    else
      console.warn "Polygon.setCenter(): ", center, "is not a valid {Point}"
      return false

  setRotation: (degrees) ->

  setRadius: (radius) ->
    return @setOuterRadius(radius)

  setInnerRadius: (radius) ->
    if typeof radius is "number"
      if radius > 0
        @_innerRadius = radius

  setOuterRadius: (radius) ->
    if typeof radius is "number"
      if radius > 0
        @_outerRadius = radius

  setNumberOfSides: (number) ->
    number = parseInt(number)
    if number >= 3
      @_numberOfSides = number
    else
      return false

  # fill: ->

  # stroke: ->

  # rotate: (degrees) ->

  _createLines: ->
    if @_center? and @_numberOfSides? and @_outerRadius?
      if @_innerRadius?
        console.log "inner and outer"
      else
        for i in [1 .. @_numberOfSides]
          console.log "Create point, relative to center"
          # point = new Point()
          # point.relativeTo(@getCenter()).atAngle(degrees, distance)
          # point.relativeTo(@getCenter()).atOffset(x, y)
