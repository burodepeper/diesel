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
      # @star.enableBoundingBox('#fff')

      # Let's try some stuff with text
      font = new Font('9PX')

      lowercase = new Text()
      lowercase.setFont(font)
      lowercase.setPosition(120, 20)
      lowercase.setColor(new Color('#fd0'))
      lowercase.setText('abcdefghijklmnopqrstuvwxyz')
      # lowercase.enableBoundingBox('#fd0')

      uppercase = new Text()
      uppercase.setFont(font)
      uppercase.setPosition(120, 29)
      uppercase.setColor(new Color('#5d0'))
      uppercase.setText('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
      # uppercase.enableBoundingBox('#5d0')

      numbers = new Text()
      numbers.setFont(font)
      numbers.setPosition(120, 38)
      numbers.setColor(new Color('#05d'))
      numbers.setText('0123456789')
      # numbers.enableBoundingBox('#05d')

      punctuation = new Text()
      punctuation.setFont(font)
      punctuation.setPosition(120, 47)
      punctuation.setColor(new Color('#c0c'))
      punctuation.setText(' !"#$%&'+"'"+'()*+,-./:;<=>?@[\\]^_`{|}~')
      # punctuation.enableBoundingBox('#c0c')

      # SpectrumAnalyzer at the bottom
      @analyzer = new SpectrumAnalyzer()

    return
