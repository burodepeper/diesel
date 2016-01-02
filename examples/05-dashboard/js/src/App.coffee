App =

  init: ->

    settings =
      viewport:
        width: 240
        height: 240

    if Engine.init(settings)

      console.log "Engine check"

      # TODO Create stars moving towards cockpit

      # TODO Create radar sweep and detection
      @radar = new Radar()
      @radar.setSize(200, 200)
      @radar.setPosition(20, 20)
      @radar.enableBoundingBox()

      # TODO Add auxilirary stuff

    return
