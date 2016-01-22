class EngineDebugPane extends Pane
  constructor: ->
    super()

    @setCSS({ bottom:2, left:2, height:6 })

    # @_label = new Text()
    # @addChild(@_label)
    # @_label.setFont(new Font('9PX'))
    # @_label.setColor(new Color('#e10'))
    # @_label.setText('debug')

    # Capacitomonitor
    @_capacity = []
    for i in [0 .. 9]
      bar = new Rectangle()
      @addChild(bar)
      bar.setSize(2, 6)
      bar.setPosition(i * 3, 0)
      bar.stretch(new Color('#fff'))
      @_capacity.push(bar)

  _update: ->
    capacity = Math.floor(Engine.getCapacity().capacity * 10)
    for i in [0 .. 9]
      bar = @_capacity[i]
      if i <= capacity
        bar.setOpacity(1)
      else
        bar.setOpacity(0.25)
