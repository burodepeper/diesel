class Radar extends Pane

  constructor: ->
    super()

    red = new Color('#e10')

    # TODO Create frame and grid
    @frame = new Circle()
    @addChild(@frame)
    @frame.setSize(200)
    @frame.outline(red)
