class Text extends Pane

  setFont: (@font) ->

  setText: (@text) ->
    @drawGlyphs()

  setColor: (@color) ->

  drawGlyphs: ->
    x = 0
    y = 0
    for i in [0 .. @text.length - 1]
      value = @text.charAt(i)
      data = @font.getGlyph(value)
      if data
        data.colors =
          1: @color
        glyph = new Sprite()
        @addChild(glyph)
        glyph.load(data)
        glyph.setPosition(x, y)
        x += glyph.getWidth() + 1
    @setSize(x - 1, @font.getHeight())
