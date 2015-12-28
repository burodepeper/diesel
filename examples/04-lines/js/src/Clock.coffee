class Clock extends Pane

  center: null
  hours: null
  minutes: null

  constructor: ->
    super()

    @center = new Point()

    @hours = new Line()
    @addChild(@hours)

    @minutes = new Line()
    @addChild(@minutes)

    @seconds = new Line()
    @addChild(@seconds)
    @seconds.setColor('#e10')

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
    @hours.atAngle(hours, 20, 0.05)

    minutes = 360 * (minutes / 60)
    @minutes.atAngle(minutes, 30, 0.0333)

    seconds = 360 * (seconds / 60)
    @seconds.atAngle(seconds, 25)
