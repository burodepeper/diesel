class Timer extends Entity

  constructor: (@_duration, @_easing = 'linear') ->
    super()

    @_start = NOW
    @_stop = @_start + @_duration

    @isComplete = false
    @percentage = 0     # raw value
    @value = 0          # value with easing applied

  # ----- Private methods -----

  _applyEasing: ->
    t = @percentage
    if @_easing is 'linear'
      return t
    else if @_easing is 'ease-in'
      return t * t
    else if @_easing is 'ease-out'
      return t * (2 - t)
    else if @_easing is 'ease-in-out'
      if t < 0.5
        return 2 * t * t
      else
        return -1 + (4 - 2 * t) * t
    else
      return t

  _update: ->
    unless @isComplete
      @percentage = (NOW - @_start) / @_duration
      @value = @_applyEasing()
      if @percentage >= 1
        @percentage = 1
        @isComplete = true
        # NOTE
        # Auto-removal is not a problem. The object where the {Timer} was created still has a reference to it. It does however leave empty spots in {Engine}, which can be cleaned up via {Engine.cleanUp()}.
        @remove()
    return
