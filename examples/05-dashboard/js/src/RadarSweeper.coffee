class RadarSweeper extends Pane

  constructor: ->
    super()

    # Random start
    @angle = getRandomInt(0, 359)

    # Full circle in 4 seconds, at 60 fps
    @angleIncrement = 360 / 4 / 60

    @line = new Line(LAYER_RADAR_UI)
    @addChild(@line)
    @line.setColor(new Color('#fff'))

  setAnchor: (@anchor) ->
    @line.from(@anchor)

  setLength: (@length) ->

  update: ->
    @line.atAngle(@angle, @length)
    @angle += @angleIncrement
    @angle %= 360
