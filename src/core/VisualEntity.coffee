class VisualEntity extends Point

  # ----- Visibility -----

  isVisible: ->
    if @_reference
      return @_isVisible and @_reference.isVisible()
    else
      return @_isVisible

  setVisibility: (visibility) ->
    if visibility
      @_isVisible = true
    else
      @_isVisible = false
    return

  show: ->
    @setVisibility(true)
    return this

  hide: ->
    @setVisibility(false)
    return this

  # ----- Appearance -----

  setOpacity: (opacity = 1) ->
    opacity = parseFloat(opacity)
    if opacity is NaN then opacity = 1
    if opacity < 0 then opacity = 0
    if opacity > 1 then opacity = 1
    @_opacity = opacity
    return

  getOpacity: ->
    return @_opacity

  setColor: (color, opacity = null) ->
    if typeof color is 'object'
      @_color = color
    else
      @_color.set(color)
    if opacity? then @setOpacity(opacity)
    return

  # ----- Private methods -----

  _init: ->
    @_opacity = 1

    if @_reference
      @_color = @_reference.getColor()
      @_isVisible = @_reference.isVisible()
    else
      @_color = new Color('#fff')
      @_isVisible = true
