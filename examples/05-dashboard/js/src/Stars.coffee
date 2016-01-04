class Stars extends Pane

  constructor: ->
    super()

  init: (@radar) ->
    @range = @radar.range
    for i in [0 .. 100]
      @createStar(getRandomInt(1, @range))

  createStar: (distance = @range) ->
    star = new Star(LAYER_STARS)
    @addChild(star)
    star.setColor(new Color('#fff'))
    star.init(distance, @range)
