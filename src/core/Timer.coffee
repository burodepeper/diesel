# Timer
# -----
# A Timer is used the non-visual representation of the passing of time. It is not impacted by the actual framerate of the Engine, so it is safe to use for any kind of movement.

class Timer extends Entity

  constructor: (@duration, @easing = 'linear') ->
    super()
    @start = NOW
    @stop = @start + @duration
    @isComplete = false
    @percentage = 0
    @value = 0

  update: ->
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
