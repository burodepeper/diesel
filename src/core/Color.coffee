class Color extends Entity

  _r: 255
  _g: 255
  _b: 255

  constructor: (color = '#fff') ->
    super()
    @set(color)

    @_tweenR = null
    @_tweenG = null
    @_tweenB = null

  # Sets the color value. Accepted forms of {color} are the regular and shorthand versions of html hex rgb color values, for example: #e10 or #33333f
  set: (color) ->
    color = @_parse(color)
    if color
      @_r = color.r
      @_g = color.g
      @_b = color.b
      return true
    else
      return false

  # Returns the current color value of this object, multiplied by a given opacity (probably from the particle invoking this method)
  get: (opacity = 1) ->
    return "rgba(#{@_r}, #{@_g}, #{@_b}, #{opacity})"

  # Creates a {Tween} which gradually changes the color over time.
  change: (color, duration = 1000, easing = 'linear') ->
    color = @_parse(color)
    if color
      if (color.r isnt @_r) then @_changeR(color.r, duration, easing)
      if (color.g isnt @_g) then @_changeG(color.g, duration, easing)
      if (color.b isnt @_b) then @_changeB(color.b, duration, easing)
    return

  # ----- Private methods -----

  _changeR: (value, duration = 1000, easing = 'linear') ->
    parameters = []
    parameters.push({ name:'value', from:@_r, to:value })
    @_tweenR = new Tween(parameters, duration, easing)
    return

  _changeG: (value, duration = 1000, easing = 'linear') ->
    parameters = []
    parameters.push({ name:'value', from:@_g, to:value })
    @_tweenG = new Tween(parameters, duration, easing)
    return

  _changeB: (value, duration = 1000, easing = 'linear') ->
    parameters = []
    parameters.push({ name:'value', from:@_b, to:value })
    @_tweenB = new Tween(parameters, duration, easing)
    return

  # Checks if the supplied string {color} is okay, and returns an object with separated {r}, {g} and {b} channels
  _parse: (color) ->
    color = color.replace(/[ ]+/g, '').toLowerCase()

    if (color.length is 7) and color.match(/#[0-9a-f]{6}/)
      r = parseInt(color.substring(1, 3), 16)
      g = parseInt(color.substring(3, 5), 16)
      b = parseInt(color.substring(5, 7), 16)
      return { r:r, g:g, b:b }

    else if (color.length is 4) and color.match(/#[0-9a-f]{3}/)
      r = parseInt(color.substring(1, 2), 16)
      g = parseInt(color.substring(2, 3), 16)
      b = parseInt(color.substring(3, 4), 16)
      r = (r * 16) + r
      g = (g * 16) + g
      b = (b * 16) + b
      return { r:r, g:g, b:b }

    # else if match = color.match(/rgba\(([0-9]+),([0-9]+),([0-9]+),([\.0-9]+)\)/)
    #   r = parseInt(match[1])
    #   g = parseInt(match[2])
    #   b = parseInt(match[3])
    #   a = parseFloat(match[4])
    #   return { r:r, g:g, b:b, a:a }

    else
      console.log "Color.set()", "#{color}' is not valid"
      return false

  _update: ->
    if @_tweenR
      @_r = Math.round(@_tweenR.getValue('value'))
      if @_tweenR.isComplete then @_tweenR = null
    if @_tweenG
      @_g = Math.round(@_tweenG.getValue('value'))
      if @_tweenG.isComplete then @_tweenG = null
    if @_tweenB
      @_b = Math.round(@_tweenB.getValue('value'))
      if @_tweenB.isComplete then @_tweenB = null
    return

  # NOTE
  # _setOpacity() is considered private, because it directly changes the opacity of the color, and not that of a particle instance which uses this color. By making the method private, accidental use will be limited, since it will most likely only be triggered via the contructor or set()
  # _setOpacity: (opacity) ->
  #   opacity = parseFloat(opacity)
  #   if opacity is NaN then opacity = 1
  #   if opacity < 0 then opacity = 0
  #   if opacity > 1 then opacity = 1
  #   @_a = opacity
