
App =

  init: ->

    settings =
      viewport:
        height: 120

    if Engine.init(settings)

      for y in [0 .. 119]
        star = new Star()
        WINDOW.addParticle(star)
        x = getRandomInt(0, WINDOW.getWidth() - 1)
        star.setColor(new Color('#fff'))
        star.setPosition(x, y)
        star.randomize()

    return
