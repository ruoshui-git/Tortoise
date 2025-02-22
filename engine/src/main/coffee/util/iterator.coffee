# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

module.exports =
  class Iterator

    _items: undefined # [T] @ Array[T]

    # (Array[T]) => Iterator[T]
    constructor: (@_items) ->

    # ((T) => Boolean) => Boolean
    all: (f) ->
      for x in @_items
        if not f(x)
          return false
      true

    # (T) => Boolean
    contains: (x) ->
      for y in @_items
        if x is y
          return true
      false

    # ((T) => Boolean) => Boolean
    exists: (f) ->
      for x in @_items
        if f(x)
          return true
      false

    # ((T) => Boolean) => Array[T]
    filter: (f) ->
      x for x in @_items when Iterator.boolOrError(x, f(x))

    # These two methods (withBoolCheck and boolOrError) are meant to help with some
    # very basic type checking using the WITH primitive.  They don't really belong
    # here, but can stay until more reobust checks are added in a more central
    # location.  -JMB July 2017

    # ((T) => Boolean) => (T) => Boolean
    @withBoolCheck: (f) ->
      (x) ->
        y = f(x)
        Iterator.boolOrError(x, y)

    # (T, Boolean) => Boolean
    @boolOrError: (x, y) ->
      if y is true or y is false
        y
      else
        throw new Error("WITH expected a true/false value from #{x}, but got #{y} instead.")

    # (Int) => T
    nthItem: (n) ->
      @_items[n]

    # [U] @ ((T) => U) => Array[U]
    map: (f) ->
      @_items.map(f)

    # ((T) => Unit) => Unit
    forEach: (f) ->
      @_items.forEach(f)
      return

    # () => Int
    size: ->
      @_items.length

    # () => Array[T]
    toArray: ->
      @_items

    # (Number, (Number, Number) => Boolean) => Boolean
    checkCount: (n, check) ->
      check(@_items.length, n)
