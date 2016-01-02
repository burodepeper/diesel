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

      @rectangle = new Rectangle()
      @rectangle.setPosition(120, 80)
      @rectangle.setSize(120, 80)
      @rectangle.stretch(red, 0.5)
      @rectangle.outline(green)

      @square = new Square()
      @square.setPosition(160, 100)
      @square.setSize(100)
      @square.stretch(green, 0.5)
      @square.outline(red)
      # @square.enableBoundingBox(white, 0.5)

      # Let's add a simple Sprite
      spriteData =
        particles: '0010002120111110212000100'
        colors:
          1: new Color('#fff')
          2: new Color('#e10')
        width: 5

      @star = new Sprite()
      @star.load(spriteData)
      @star.setPosition(100, 20)
      @star.enableBoundingBox('#fff')

      # SpectrumAnalyzer at the bottom
      @analyzer = new SpectrumAnalyzer()

    return
