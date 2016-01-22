class Text extends Pane

  setFont: (@font) ->

  setText: (text) ->
    @text = text + "" # Force {@text} to be a string
    # @clear()
    @_drawGlyphs()

  setColor: (@color) ->

  clear: ->
    for child in @children
      child.remove()

  _drawGlyphs: ->
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
        console.log glyph
    @setSize(x - 1, @font.getHeight())
