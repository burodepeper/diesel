class Sprite extends Pane

  constructor: (@_layer = 1) ->
    super(@_layer)

  load: (@data) ->
    if @parseData()
      for i in [0 .. @data.particles.length - 1]
        value = @data.particles.charAt(i)
        x = i % @data.width
        y = Math.floor(i / @data.width)

        if value isnt '0'
          particle = new Particle()
          @addParticle(particle)
          particle.setColor(@data.colors[value])
          particle.setPosition(x, y)

    else
      console.error "Sprite.load(): Can't load Sprite, data is not valid", @data

  parseData: ->
    # Are {width}, {particles} and {colors} specified?
    if @data.particles? and @data.colors? and @data.width?
      # Does the number of particles match the width?
      if @data.particles.length % @data.width is 0
        height = @data.particles.length / @data.width
        @setSize(@data.width, height)
        # Are all values in {particles} available in {colors}?
        for i in [0 .. @data.particles.length - 1]
          value = @data.particles.charAt(i)
          if value isnt '0'
            unless @data.colors[value]?
              console.warn "Sprite.parseData():", value, "is not a valid color index"
              return false
      else
        console.warn "Sprite.parseData(): number of particles (#{@data.particles.length}) isn't a multiple of width (#{@data.width})"
        return false
    return true
