class Tracker extends Controller
  constructor: (@_target) ->
    super()

    @_marker = new Circle(LAYER_UI)
    @_marker.setRadius(3)
    @_marker.setCenter(@_target)
    @_marker.outline(new Color('#e10'))
    @_marker.hide()

  _update: ->
    threshold = App.spaceship.getSpeed() * 100
    if @_target._distance < threshold
      @_marker.show()
      # @_marker.setOpacity(@_target.getOpacity())
      @_marker.setOpacity(1 - (@_target._distance / threshold))
    else
      @_marker.hide()

  remove: ->
    @_marker.remove()
    super()
