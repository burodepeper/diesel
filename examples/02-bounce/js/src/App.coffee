
App =

  init: ->

    settings =
      viewport:
        width: 160
        height: 90

    if Engine.init(settings)

      # Create panes
      @red = new PaneController()
      @red.setSize(20)
      @red.setY(0)
      @red.setColor('#e10')
      @red.init()

      @green = new PaneController()
      @green.setSize(30)
      @green.setY(20)
      @green.setColor('#5d0')
      @green.init()

      @blue = new PaneController()
      @blue.setSize(40)
      @blue.setY(50)
      @blue.setColor('#05d')
      @blue.init()

    return
