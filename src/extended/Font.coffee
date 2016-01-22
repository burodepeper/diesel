class Font

  constructor: (name) ->
    @name = "FONT_" + name
    if window[@name]
      @_loadFont()
    else
      console.error "Font(): '#{@name}' doesn't exist"

  _loadFont: ->
    @data = window[@name]

  getGlyph: (glyph) ->
    if @data.glyphs[glyph]?
      data = @_isValid(@data.glyphs[glyph])
      unless data
        console.log "Font.getGlyph(): data for '#{glyph}' in '#{@name}' is not valid"
      return data
    else
      console.warn "Font.getGlyph(): '#{glyph}' not found in '#{@name}'"
      return false

  getHeight: ->
    return @data.height

  _isValid: (data) ->
    if data.length % @data.height is 0
      return { particles:data, width:data.length / @data.height }
    else
      return false
