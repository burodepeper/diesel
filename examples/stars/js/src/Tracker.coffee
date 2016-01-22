class Tracker extends Controller
  constructor: (@_target) ->
    super()

    @_marker = new Circle(LAYER_UI)
    @_marker.setRadius(3)
    @_marker.setCenter(@_target)
    @_marker.outline(new Color('#e10'))
    @_marker.hide()

    @_label = new Text(LAYER_UI)
    @_label._setReference(@_target)
    @_label.setPosition(5, -3)
    @_label.setFont(new Font('9PX'))
    @_label.setColor(new Color('#e10'))
    @_label.setText(Math.floor(@_target.passingDistance))
    @_label.hide()

  _update: ->
    threshold = App.spaceship.getSpeed() * 100
    if @_target._distance < threshold
      @_marker.show()
      @_marker.setOpacity(1 - (@_target._distance / threshold))

      @_label.show()
      @_label.setOpacity(1 - (@_target._distance / threshold))
      # @_label.setText(Math.floor(@_target._distance))
    else
      @_marker.hide()
      @_label.hide()

  remove: ->
    @_marker.remove()
    @_label.remove()
    super()
