class Polygon extends Path
  constructor: ->
    super()

    _numberOfSides: null
    _center: null
    _innerRadius: null
    _outerRadius: null

  setCenter: (center) ->

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

  _createLines: ->
    if @_center? and @_numberOfSides? and @_outerRadius?
      if @_innerRadius?
        console.log "inner and outer"
      else
        console.log "outer"
        for i in [1 .. @_numberOfSides]
          point = new Point()
