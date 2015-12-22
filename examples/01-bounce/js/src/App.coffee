
App =

  init: ->
    settings =
      viewport: { width: 480, height: 270 }
    Engine.init(settings)

    # TODO
    # Create panes
    @leftPane = new Pane()
    @leftPane.setCSS({ left:0, top:0, bottom:0, width:160 })

    @centerPane = new Pane()
    @centerPane.setCSS({ left:160, top:0, bottom:0, width:160 })

    @rightPane = new Pane()
    @rightPane.setCSS({ right:0, top:0, bottom:0, width:160 })

    console.log @centerPane
    @centerPane.onResize()

    # TODO
    # Create bouncing particles inside those panes

    return
