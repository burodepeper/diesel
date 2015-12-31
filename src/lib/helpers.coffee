isPoint = (x, y) ->
  if typeof x is 'object'
    if x.constructor.name is 'Point'
      return x
    else if (x.x and typeof x.x is 'number') and (x.y and typeof x.y is 'number')
      return new Point(x.x, x.y)
    else if Array.isArray(x) and x.length is 2
      return new Point(x[0], x[1])
    else
      console.warn "isPoint()", x, "is not valid"
  else if (typeof x is 'number') and (typeof y is 'number')
    return new Point(x, y)
  else
    console.warn "isPoint()", x+","+y, "is not valid"
    return false
