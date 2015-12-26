class SpectrumAnalyzer extends Controller

  constructor: ->
    super()

    @pane = new Pane()
    @pane.setCSS({ left:1, right:1, bottom:1, height:43 })
