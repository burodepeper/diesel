class Radar extends Controller
  constructor: ->
    super()

  track: (star, priority = false) ->
    tracker = new Tracker(star)
    return tracker
