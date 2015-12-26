class Clock extends Pane

  center: null
  hours: null
  minutes: null

  constructor: ->
    super()

    @center = new Point()
    @hours = new Line()
    @minutes = new Line()
    @seconds = new Line()

    @addChild(@hours)
    @addChild(@minutes)
    @addChild(@seconds)

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
