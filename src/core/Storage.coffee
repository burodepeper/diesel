class Storage

  constructor: (@type = 'localStorage') ->
    @storage = window[@type]
    unless @isAvailable()
      console.warn @type, "is NOT available"

  isAvailable: ->
    try
      x = '__storage_test__'
      @storage.setItem(x, x)
      @storage.removeItem(x)
      return true
    catch error
      return false

  get: (key) ->
    value = @storage.getItem(key)
    # if value and (value[0] is "{" or value[0] is "[")
    value = JSON.parse(value)

  set: (key, value) ->
    # if typeof value is "object"
    value = JSON.stringify(value)
    @storage.setItem(key, value)
