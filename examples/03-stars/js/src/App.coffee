
App =

  init: ->

    settings =
      viewport:
        height: 120

    if Engine.init(settings)

      for y in [0 .. 119]
        star = new Star()
        x = getRandomInt(0, WINDOW.getWidth() - 1)
        star.setPosition(x, y)
        star.randomize()

    return
