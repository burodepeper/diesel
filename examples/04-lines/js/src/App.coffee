App =

  init: ->

    settings =
      viewport:
        width: 240
        height: 180

    if Engine.init(settings)

      # Clock in top right corner
      @clock = new Clock()
      @clock.setCSS({ top:1, right:1, width:59, height:59 })

      # SpectrumAnalyzer at the bottom
      @analyzer = new SpectrumAnalyzer()

    return
