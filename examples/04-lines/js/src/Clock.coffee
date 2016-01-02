class Clock extends Pane

  constructor: ->
    super()

    @createDial()

    @hours = new Line()
    @addChild(@hours)
    # @hours.setWeight(2)
    @hours.from(@dial.center)

    @minutes = new Line()
    @addChild(@minutes)
    @minutes.from(@dial.center)

    @seconds = new Line()
    @addChild(@seconds)
    @seconds.setColor(new Color('#e10'))
    @seconds.from(@dial.center)
    # @seconds.enableBoundingBox('#e10')

  update: ->
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

    # Background circle thing
    @dial = new Circle(1)
    @addChild(@dial)
    @dial.setSize(59)
    @dial.stretch('rgba(255, 255, 255, 0.15)')
    @dial.outline(new Color('rgba(255, 255, 255, 0.15)'))

    # Hour marks
    color = new Color('rgba(255, 255, 255, 0.3)')
    for i in [0 .. 11]
      degrees = i * 30
      line = new Line(2)
      @addChild(line)
      line.from(@dial.center).atAngle(degrees, @dial.radius, 0.8)
      line.setColor(color)
