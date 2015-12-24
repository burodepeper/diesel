
App =

  init: ->

    settings =
      viewport:
        height: 120

    if Engine.init(settings)
      console.log "Something"

    return
