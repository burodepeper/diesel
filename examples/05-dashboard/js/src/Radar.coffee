class Radar extends Pane

  colors:
    red: new Color('#e10')
    grey: new Color('rgba(255, 255, 255, 0.15)')

  constructor: ->
    super()

    diameter = 200
    large = 0.9
    medium = 0.5
    small = 0.25

    # TODO Create frame and grid
    @frame = new Circle(LAYER_RADAR_DECORATION)
    @addChild(@frame)
    @frame.setSize(diameter)
    @frame.outline(@colors.red)

    circle = new Circle(LAYER_RADAR_DECORATION)
    @addChild(circle)
    size = diameter * large
    position = (diameter - size) / 2
    circle.setSize(size)
    circle.outline(@colors.grey)
    circle.setPosition(position, position)

    circle = new Circle(LAYER_RADAR_DECORATION)
    @addChild(circle)
    size = diameter * medium
    position = (diameter - size) / 2
    circle.setSize(size)
    circle.outline(@colors.grey)
    circle.setPosition(position, position)

    circle = new Circle(LAYER_RADAR_DECORATION)
    @addChild(circle)
    size = diameter * small
    position = (diameter - size) / 2
    circle.setSize(size)
    circle.outline(@colors.grey)
    circle.setPosition(position, position)

    center = @frame.getCenter()
    numberOfSpokes = 24
    increment = 360 / numberOfSpokes
    length = (diameter / 2) * large
    angle = 0
    for i in [0 .. numberOfSpokes - 1]
      offset = if (i % 3 isnt 0) then (medium / large) else small
      line = new Line(LAYER_RADAR_DECORATION)
      @addChild(line)
      line.from(center).atAngle(angle, length, offset)
      line.setColor(@colors.grey)
      angle += increment
