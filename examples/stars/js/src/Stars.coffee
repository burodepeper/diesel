class Stars extends Pane
  constructor: ->
    super()

    @width = WINDOW.getWidth()
    @height = WINDOW.getHeight()
    @center = WINDOW.getCenter()

    # 5000 stars is acceptable on big machine
    numberOfStars = @width * @height / 10 / 4
    for i in [1 .. numberOfStars]
      z = getRandomInt(100, 10000)
      @addStar(z)

  addStar: (z = 10000) ->
    x = getRandomInt(0, @width * 10) - (@width * 5)
    y = getRandomInt(0, @height * 10) - (@height * 5)
    star = new Star(LAYER_STARS)
    star.setCoordinates(x, y, z)
