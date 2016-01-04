class StarLabel extends Pane

  constructor: (@star) ->
    super()

    @circle = new Circle(LAYER_RADAR_UI)
    @addChild(@circle)
    @circle.setSize(5)
    @circle.setPosition(-2, -2)
    @circle.outline('rgba(255, 0, 0, 0.5)')

    font = new Font('9PX')

    @label = new Text(LAYER_RADAR_UI)
    @addChild(@label)
    @label.setFont(font)
    @label.setPosition(4, -4)
    @label.setText(@star.z)

  update: ->
    @setPosition(@star.getX(), @star.getY())
    # @label.setText(@star.z)
    @circle.hasChanged = true
    @label.hasChanged = true
    super()

  remove: ->
    @circle.remove()
    @label.remove()
    super()
