App =

  init: ->

    settings =
      viewport:
        width: 240
        height: 180

    if Engine.init(settings)

      # TODO
      # Clock in top right corner

      # TODO
      # SpectrumAnalyzer at the bottom
      @analyzer = new SpectrumAnalyzer()

    return
