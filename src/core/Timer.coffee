class Timer extends Entity

  constructor: (@duration, @easing = 'linear') ->
    super()
    @start = NOW
    @stop = @start + @duration
    @isComplete = false
    @percentage = 0
    @value = 0

  _update: ->
    unless @isComplete
      @percentage = (NOW - @start) / @duration
      @value = @applyEasing()
      if @percentage >= 1
        @percentage = 1
        @isComplete = true
        # NOTE
        # I think auto removal is okay, because a reference to the object remains where it is created, so the content stays accessible until it is deleted there?
        @remove()
    return

  applyEasing: ->
    t = @percentage
    if @easing is 'linear'
      return t
    else if @easing is 'ease-in'
      return t * t
    else if @easing is 'ease-out'
      return t * (2 - t)
    else if @easing is 'ease-in-out'
      if t < 0.5
        return 2 * t * t
      else
        return -1 + (4 - 2 * t) * t
    else
      return t
