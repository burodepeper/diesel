layer = 1
LAYER_BACKGROUND = layer++
LAYER_STARS = layer++
LAYER_UI = layer++

App =
  init: ->
    settings =
      debug: true
      viewport:
        width: 320
        height: 180
        # grid: true

    if Engine.init(settings)

      @spaceship = new Spaceship()
      @radar = new Radar()

      @stars = new Stars()
      @stars.setCSS({ top:0, right:0, bottom:0, left:0 })

      @spaceship.accelerateTo(10)

      # TODO
      # - Radar
      #   - Circles and stuff, preferable animated
      #   - Track stars within a certain limit
      # - Histogram displaying number of stars at respective distances
      # - Speed + controls

    return
