
# Tween
# -----------------------------------------------------------------------------
# A tween is an often used extension of a Timer, that represents the relative
# change of one or more values based on a single Timer.

class Tween extends Timer

  constructor: (data, @duration, @easing = 'linear') ->
    super(@duration, @easing)
    @parseParameters(data)

  parseParameters: (data) ->
    @items = {}
    @parameters = [] # used from the caster of the tween
    for item in data
      @parameters.push(item.name)
      @items[item.name] =
        from: item.from
        to: item.to
        difference: item.to - item.from
        min: Math.min(item.from, item.to)
        max: Math.max(item.from, item.to)
    return

  getValue: (name) ->
    item = @items[name]
    if @value >= 0
      value = item.from + (@value * item.difference)
      if value < item.min then value = item.min
      if value > item.max then value = item.max
    else
      value = item.min
    return value
