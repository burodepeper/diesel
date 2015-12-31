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

      # Draw some rectangular overlapping shapes as a test
      red = new Color('#e10')
      green = new Color('#5d0')
      white = new Color('#fff')

      @rectangle = new Rectangle(1)
      @rectangle.setPosition(120, 80)
      @rectangle.setSize(120, 80)
      @rectangle.setColor(red, 0.5)
      @rectangle.enableBoundingBox(white)
      # @rectangle.fill()
      @rectangle.outline(green)

      @square = new Square(1)
      @square.setPosition(160, 100)
      @square.setSize(100)
      @square.setColor(green, 0.5)
      @square.enableBoundingBox(white)
      # @square.fill()
      @square.outline(red)

      # SpectrumAnalyzer at the bottom
      @analyzer = new SpectrumAnalyzer()

    return
