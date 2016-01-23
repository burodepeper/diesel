layer = 1
LAYER_BACKGROUND = layer++
LAYER_FOREGROUND = layer++

App =
  init: ->
    settings =
      debug: true
      viewport:
        width: 320
        height: 180
        # grid: true

    if Engine.init(settings)

      @color = new Color('#fff')

      @font = new Font("9PX")

      @text = new Text(LAYER_FOREGROUND)
      @text.setFont(@font)
      @text.setPosition(10, 10)
      @text.setColor(@color)
      @text.setText('apple')

    return
