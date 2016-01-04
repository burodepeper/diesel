class Stars extends Pane

  constructor: ->
    super()

  init: (@radar) ->
    @range = @radar.range
    for i in [0 .. 10]
      @createStar(getRandomInt(1, @range))

  createStar: (distance = @range) ->
    star = new Star()
    @addChild(star)
    star.init(distance, @range)
