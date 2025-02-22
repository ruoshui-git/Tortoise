# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

EN_US = require('./en_us')

# At the moment this doesn't do much but it'd be a good place to add
# the ability to swap the current locale as needed.
# -Jeremy B November 2020

class I18nBundle

  _current = null

  constructor: () ->
    @_current = EN_US

  get: (key, args...) ->
    bundle = if @_current.hasOwnProperty(key)
      @_current
    else if @_current isnt EN_US and EN_US.hasOwnProperty(key)
      EN_US
    else
      throw new Error("Could not find a message for this key: #{key}")

    message = bundle[key]
    message(args...)

module.exports = I18nBundle
