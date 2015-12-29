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

      # SpectrumAnalyzer at the bottom
      @analyzer = new SpectrumAnalyzer()

    return
