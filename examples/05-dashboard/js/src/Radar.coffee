class Radar extends Pane

  colors:
    red: new Color('#e10')
    grey: new Color('rgba(255, 255, 255, 0.15)')

  constructor: ->
    super()

    # TODO Create frame and grid
    @frame = new Circle(LAYER_RADAR_DECORATION)
    @addChild(@frame)
    @frame.setSize(200)
    @frame.outline(@colors.red)

    circle = new Circle(LAYER_RADAR_DECORATION)
    @addChild(circle)
    circle.setSize(200 * 0.9)
    circle.outline(@colors.grey)
    circle.setPosition(10, 10)

    circle = new Circle(LAYER_RADAR_DECORATION)
    @addChild(circle)
    circle.setSize(200 * 0.5)
    circle.outline(@colors.grey)
    circle.setPosition(50, 50)

    circle = new Circle(LAYER_RADAR_DECORATION)
    @addChild(circle)
    circle.setSize(200 * 0.1)
    circle.outline(@colors.grey)
    circle.setPosition(90, 90)

    center = @frame.getCenter()
    numberOfSpokes = 24
    increment = 360 / numberOfSpokes
    length = 90
    angle = 0
    for i in [0 .. numberOfSpokes - 1]
      angle += increment
      offset = if (i % 2) then 0.556 else 0.1
      line = new Line(LAYER_RADAR_DECORATION)
      @addChild(line)
      line.from(center).atAngle(angle, length, offset)
      line.setColor(@colors.grey)
