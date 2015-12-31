App =

  init: ->

    settings =
      viewport:
        width: 480
        height: 270

    if Engine.init(settings)

      # Clock in top right corner
      @clock = new Clock()
      @clock.setCSS({ top:5, left:5, width:59, height:59 })

      # TODO
      # Make the clock more pretty
      # - draw circle
      # - draw hour marks
      # - color seconds Line red

      # TODO
      # Draw some rectangular overlapping shapes as a test
      red = new Color('#e10')
      green = new Color('#5d0')
      white = new Color('#fff')

      @rectangle = new Rectangle(1)
      @rectangle.setPosition(120, 80)
      @rectangle.setSize(120, 80)
      @rectangle.setColor(red)
      @rectangle.setOpacity(0.5)
      @rectangle.enableBoundingBox(white)

      @square = new Square(1)
      @square.setPosition(160, 100)
      @square.setSize(100)
      @square.setColor(green)
      @square.setOpacity(0.5)
      @square.enableBoundingBox(white)

      # SpectrumAnalyzer at the bottom
      @analyzer = new SpectrumAnalyzer()

    return
