# Snap values to grid
# NOTE: doesn't work for fractions yet
snap = (value) ->
  return Math.round(value / PX) * PX

# Wrapper to make setTimeout() more convenient in Coffeescript
delay = (ms, func) -> setTimeout func, ms

# Returns a random int between and including low and high.
# Assumes low < high, and that both are integers.
getRandomInt = (low, high) ->
  diff = (high - low) + 1
  diff = Math.random() * diff
  return low + Math.floor diff

# Returns a random int between and including low and high.
# Assumes low < high, and that both are integers.
# Gravity dictates whether the result will be more towards low, high, or middle.
# I am no mathematician, but it seems to work. The average weight of a low/high
# seems to be at about a third.
getWeighedInt = (low, high, gravity, i) ->
  r = Math.random()
  chance = Math.sqrt(Math.random())
  diff = (high - low) + 1
  okay = false

  # Default gravity is a gradient to the bottom
  unless gravity? then gravity = "high"
  # i counts iterations, but is not used as a failsafe yet
  unless i? then i = 0

  if gravity is "low"
    if chance >= r
      okay = true
  else if gravity is "high"
    if chance <= r
      okay = true
  else if gravity is "middle" or "center"
    chance /= 2
    if r >= chance and r <= 1 - chance
      okay = true

  if okay
    return low + Math.floor diff * r
  else
    return getWeighedInt low, high, gravity, i + 1

# Return a random value from a 1-dimensional array
getRandomFromArray = (array) ->
  return array[getRandomInt 0, array.length - 1]

# Return a weighted random value from an object with the assumed structure:
# {
#   key: (int) value,
#   key: (int) value
# }
getRandomFromObject = (data) ->
  total = 0
  for key, value of data
    total += value
    data[key] = total
  r = getRandomInt(1, total)
  for key, value of data
    if r <= value
      return key

# Calculates the average value of all values in data
average = (data) ->
  total = 0
  for value in data
    total += value
  return (total / data.length)

# See: https://github.com/coolaj86/knuth-shuffle
shuffle = (array) ->
  currentIndex = array.length
  while 0 isnt currentIndex
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  return array

# Returns a value that is randomly offset by the diversity factor
addDiversity = (value, diversity = 0.5) ->
  return (value * (1 - diversity)) + (value * Math.random() * diversity * 2)
