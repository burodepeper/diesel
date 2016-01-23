class Text extends Pane

  setFont: (@font) ->

  setText: (text) ->
    @_oldText = @_text
    @_text = text + "" # Force {@text} to be a string
    @_drawGlyphs()

  setColor: (@color) ->

  # _clear: ->
  #   for child in @_children
  #     child.remove()

  _drawGlyphs: ->
    x = 0
    y = 0

    for i in [0 .. @_text.length - 1]
      value = @_text.charAt(i)
      data = @font.getGlyph(value)
      if data
        data.colors =
          1: @color

        glyph = @getChild(i)
        unless glyph
          glyph = new Sprite()
          @addChild(glyph)

        glyph.load(data)
        glyph.setPosition(x, y)
        x += glyph.getWidth() + 1

    @setSize(x - 1, @font.getHeight())

    if @_oldText and (@_oldText.length > @_text.length)
      redundantGlyphs = @_oldText.length - @_text.length
      for i in [0 .. redundantGlyphs - 1]
        @getChild(@_text.length + i).hide()
