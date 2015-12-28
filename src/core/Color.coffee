class Color extends Entity

  r: 255
  g: 255
  b: 255
  a: 1
  asString: null

  constructor: (color = '#fff') ->
    super()
    @set(color)

  set: (color) ->

    # remove spaces and convert to lowercase
    color = color.replace(/[ ]+/g, '').toLowerCase()

    if (color.length is 7) and color.match(/#[0-9a-f]{6}/)
      @r = parseInt(color.substring(1, 3), 16)
      @g = parseInt(color.substring(3, 5), 16)
      @b = parseInt(color.substring(5, 7), 16)
      @a = 1
      @compile()

    else if (color.length is 4) and color.match(/#[0-9a-f]{3}/)
      r = parseInt(color.substring(1, 2), 16)
      g = parseInt(color.substring(2, 3), 16)
      b = parseInt(color.substring(3, 4), 16)
      @r = (r * 16) + r
      @g = (g * 16) + g
      @b = (b * 16) + b
      @a = 1
      @compile()

    else if match = color.match(/rgba\(([0-9]+),([0-9]+),([0-9]+),([\.0-9]+)\)/)
      @r = parseInt(match[1])
      @g = parseInt(match[2])
      @b = parseInt(match[3])
      @a = parseFloat(match[4])
      @compile()

    else
      console.log "Color.set()", "#{color}' is not valid"
      return false

  setOpacity: (opacity) ->
    opacity = parseFloat(opacity)
    if opacity is NaN then opacity = 1
    if opacity < 0 then opacity = 0
    if opacity > 1 then opacity = 1
    @a = opacity
    @compile()

  compile: ->
    @asString = "rgba(#{@r}, #{@g}, #{@b}, #{@a})"

  toString: ->
    return @asString
