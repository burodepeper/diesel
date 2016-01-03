layer = 1
LAYER_STARS = layer++
LAYER_RADAR_DECORATION = layer++
LAYER_RADAR_UI = layer++

App =

  init: ->

    settings =
      viewport:
        width: 320
        height: 180

    if Engine.init(settings)

      # TODO Create radar sweep and detection
      @radar = new Radar()
      diameter = @radar.diameter
      css =
        width: diameter
        height: diameter
        left: 'center'
        top: 'center'
      @radar.setCSS(css)

      # TODO Create stars moving towards cockpit
      @stars = new Stars()
      @stars.setCSS(css)
      @stars.init(@radar)

      # TODO Add auxiliary stuff

    return
