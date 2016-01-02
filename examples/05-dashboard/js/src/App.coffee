layer = 1
LAYER_STARS = layer++
LAYER_RADAR_DECORATION = layer++
LAYER_RADAR_UI = layer++

App =

  init: ->

    settings =
      viewport:
        width: 240
        height: 240

    if Engine.init(settings)

      # TODO Create stars moving towards cockpit

      # TODO Create radar sweep and detection
      @radar = new Radar()
      @radar.setSize(200, 200)
      @radar.setPosition(20, 20)

      # TODO Add auxiliary stuff

    return
