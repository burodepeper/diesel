class Stars extends Pane

  constructor: ->
    super()

    @origin = new Point(80, 80)

    for i in [0 .. 10]
      star = new Star(LAYER_STARS)
      @addChild(star)
      star.setOrigin(@origin)
      star.randomize()
