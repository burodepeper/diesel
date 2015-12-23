
App =

  init: ->

    settings =
      viewport:
        width: 120
        height: 90

    if Engine.init(settings)

      # Create panes
      @leftPane = new Pane()
      @leftPane.setCSS({ left:0, top:0, bottom:0, width:40 })

      @centerPane = new Pane()
      @centerPane.setCSS({ left:40, top:0, bottom:0, width:40 })

      @rightPane = new Pane()
      @rightPane.setCSS({ right:0, top:0, bottom:0, width:40 })

      # Create randomly bouncing particles
      for i in [1 .. 40]
        red = new BouncingParticle()
        @leftPane.addChild(red)
        red.setColor("#e10")
        red.setRandomPosition()
        red.setRandomMomentum()

        green = new BouncingParticle()
        @centerPane.addChild(green)
        green.setColor("#5d0")
        green.setRandomPosition()
        green.setRandomMomentum()

        blue = new BouncingParticle()
        @rightPane.addChild(blue)
        blue.setColor("#05d")
        blue.setRandomPosition()
        blue.setRandomMomentum()

    return
