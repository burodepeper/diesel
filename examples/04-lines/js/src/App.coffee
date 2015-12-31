App =

  init: ->

    settings =
      viewport:
        width: 480
        height: 270

    if Engine.init(settings)

      # Clock in top right corner
      @clock = new Clock()
      @clock.setCSS({ top:1, left:1, width:59, height:59 })

      # TODO
      # Make the clock more pretty
      # - draw circle
      # - draw hour marks
      # - color seconds Line red

      # TODO
      # Draw some rectangular overlapping shapes as a test
      red = new Color('#e10')
      @rectangle = new Rectangle(1)
      @rectangle.setPosition(120, 80)
      @rectangle.setSize(120, 80)
      @rectangle.setColor(red)
      @rectangle.setOpacity(0.5)

      green = new Color('#5d0')
      @square = new Square(1)
      @square.setPosition(160, 100)
      @square.setSize(100)
      @square.setColor(green)
      @square.setOpacity(0.5)

      # SpectrumAnalyzer at the bottom
      @analyzer = new SpectrumAnalyzer()

    return
