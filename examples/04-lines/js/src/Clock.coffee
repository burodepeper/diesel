class Clock extends Pane

  center: null
  hours: null
  minutes: null

  constructor: ->
    super()

    @center = new Point()

    @createDial()

    @hours = new Line()
    @addChild(@hours)
    @hours.setWeight(2)
    # @hours.enableBoundingBox('#fff')

    @minutes = new Line()
    @addChild(@minutes)
    # @minutes.enableBoundingBox('#fff')

    @seconds = new Line()
    @addChild(@seconds)
    @seconds.setColor(new Color('#e10'))
    # @seconds.enableBoundingBox('#e10')

  update: ->
    center = @getCenter()
    @center.x = center.x
    @center.y = center.y
    @hours.from(@center)
    @minutes.from(@center)
    @seconds.from(@center)

    time = new Date()
    seconds = time.getSeconds()
    minutes = time.getMinutes() + (seconds / 60)
    hours = time.getHours() + (minutes / 60)

    hours = 360 * ((hours % 12) / 12)
    @hours.atAngle(hours, 20)

    minutes = 360 * (minutes / 60)
    @minutes.atAngle(minutes, 27.5)

    seconds = 360 * (seconds / 60)
    @seconds.atAngle(seconds, 24)

  createDial: ->

    center = new Point(29, 29)
    radius = 29.5

    # Background circle thing
    @dial = new Circle(1)
    @addChild(@dial)
    @dial.setCenter(center)
    @dial.setRadius(radius)
    @dial.fill()
    @dial.setColor(new Color('rgba(255, 255, 255, 0.15)'))
    # @dial.enableBoundingBox('#fd0')

    # Hour marks
    color = new Color('rgba(255, 255, 255, 0.3)')
    for i in [0 .. 11]
      degrees = i * 30
      line = new Line(2)
      @addChild(line)
      line.from(center).atAngle(degrees, radius, 0.8)
      line.setColor(color)
