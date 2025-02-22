# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

projectionSort = require('./projectionsort')
{ checks }     = require('./typechecker')
Iterator       = require('util/iterator')
Shufflerator   = require('util/shufflerator')
stableSort     = require('util/stablesort')

{ foldl, map } = require('brazierjs/array')
{ pipeline   } = require('brazierjs/function')
{ keys       } = require('brazierjs/object')

{ DeathInterrupt: Death } = require('util/exception')

# Never instantiate this class directly --JAB (5/7/14)
module.exports =
  class AbstractAgentSet

    # (Array[T], World, String, String) => AbstractAgentSet
    constructor: (@_agentArr, @_world, @_agentTypeName, @_specialName) ->

    # (() => Boolean) => AbstractAgentSet[T]
    agentFilter: (f) ->
      @filter(Iterator.withBoolCheck(@_world.selfManager.askAgent(f)))

    # (() => Boolean) => Boolean
    agentAll: (f) ->
      @_unsafeIterator().all(@_world.selfManager.askAgent(f))

    # (() => Any, Boolean) => Unit
    ask: (f, shouldShuffle) ->

      iter =
        if shouldShuffle
          @shufflerator()
        else
          @iterator()

      iter.forEach(@_world.selfManager.askAgent(f))

      if @_world.selfManager.self().isDead?()
        throw new Death

      return

    # (Array[(Number, Number)]) => AbstractAgentSet[T]
    atPoints: (points) ->
      getSelf    =        => @_world.selfManager.self()
      getPatchAt = (x, y) => @_world.getPatchAt(x, y)
      require('./agentset/atpoints')(@_world.dump, getSelf, getPatchAt).call(this, points)

    # (T) => Boolean
    contains: (item) ->
      @_unsafeIterator().contains(item)

    # (Array[T]) => AbstractAgentSet[T]
    copyWithNewAgents: (agents) ->
      @_generateFrom(agents)

    # ((T) => Boolean) => Boolean
    exists: (pred) ->
      @_unsafeIterator().exists(pred)

    # ((T) => Boolean) => Seq[T]
    filter: (pred) ->
      @_generateFrom(@_unsafeIterator().filter(pred))

    # ((T) => Unit) => Unit
    forEach: (f) ->
      @iterator().forEach(f)
      return

    # () => String
    getSpecialName: ->
      @_specialName

    # () => Boolean
    isEmpty: ->
      @size() is 0

    # () => Iterator[T]
    iterator: ->
      new Iterator(@_agentArr[..])

    # This is marked "private" and named "unsafe" for a reason.  Since it does not copy the underlying agent array
    # it should only be used internally by the agent set when the resulting Iterator will immediately calculate or
    # tranform to a new value for the consumer.  --JMB, August 2018

    # () => Iterator[T]
    _unsafeIterator: ->
      new Iterator(@_agentArr)

    # (() => Number) => AbstractAgentSet[T]
    maxesBy: (f) ->
      @copyWithNewAgents(@_findMaxesBy(f))

    # (Number, () => Number) => AbstractAgentSet[T]
    maxNOf: (n, f) ->

      if n > @size()
        throw new Error("Requested #{n} random agents from a set of only #{@size()} agents.")

      if n < 0
        throw new Error("First input to MAX-N-OF can't be negative.")

      @_findBestNOf(n, f, (x, y) -> if x is y then 0 else if x > y then -1 else 1)

    # (() => Number) => T
    maxOneOf: (f) ->
      @_randomOneOf(@_findMaxesBy(f))

    # (Number, () => Number) => AbstractAgentSet[T]
    minNOf: (n, f) ->

      if n > @size()
        throw new Error("Requested #{n} random agents from a set of only #{@size()} agents.")

      if n < 0
        throw new Error("First input to MIN-N-OF can't be negative.")

      @_findBestNOf(n, f, (x, y) -> if x is y then 0 else if x < y then -1 else 1)

    # (() => Number) => T
    minOneOf: (f) ->
      @_randomOneOf(@_findMinsBy(f))

    # (() => Number) => AbstractAgentSet[T]
    minsBy: (f) ->
      @copyWithNewAgents(@_findMinsBy(f))

    # [Result] @ (() => Result) => Array[Result]
    projectionBy: (f) ->
      @shufflerator().map(@_world.selfManager.askAgent(f))

    # () => T
    randomAgent: () ->
      iter  = @_unsafeIterator()
      count = iter.size()
      if count is 0
        Nobody
      else
        choice = @_world.rng.nextInt(count)
        iter.nthItem(choice)

    # () => AbstractAgentSet[T]
    shuffled: ->
      @copyWithNewAgents(@shufflerator().toArray())

    # () => Shufflerator[T]
    shufflerator: ->
      new Shufflerator(@toArray(), ((agent) -> agent?.id >= 0), @_world.rng.nextInt)

    # () => Number
    size: ->
      @_unsafeIterator().size()

    # () => Array[T]
    sort: ->
      if @isEmpty()
        @toArray()
      else
        stableSort(@_unsafeIterator().toArray())((x, y) -> x.compare(y).toInt)

    # [U] @ ((T) => U) => Array[T]
    sortOn: (f) ->
      projectionSort(@shufflerator().toArray())(f)

    # () => Array[T]
    toArray: ->
      @_agentArr = @_unsafeIterator().toArray() # Prune out dead agents --JAB (7/21/14)
      @_agentArr[..]

    # () => String
    toString: ->
      @_specialName?.toLowerCase() ? "(agentset, #{@size()} #{@_agentTypeName})"

    # (Number, () => Number, (Number, Number) => Number) => AbstractAgentSet[T]
    _findBestNOf: (n, f, cStyleComparator) ->

      ask = @_world.selfManager.askAgent(f)

      groupByValue =
        (acc, agent) ->
          result = ask(agent)
          if checks.isNumber(result)
            entry = acc[result]
            if entry?
              entry.push(agent)
            else
              acc[result] = [agent]
          acc

      appendAgent =
        ([winners, numAdded], agent) ->
          if numAdded < n
            winners.push(agent)
            [winners, numAdded + 1]
          else
            [winners, numAdded]

      collectWinners =
        ([winners, numAdded], agents) ->
          if numAdded < n
            foldl(appendAgent)([winners, numAdded])(agents)
          else
            [winners, numAdded]

      valueToAgentsMap = foldl(groupByValue)({})(@shufflerator().toArray())
      [best, []] =
        pipeline(keys
               , map(parseFloat)
               , ((x) -> x.sort(cStyleComparator))
               , map((value) -> valueToAgentsMap[value])
               , foldl(collectWinners)([[], 0])
               )(valueToAgentsMap)

      @_generateFrom(best)

    # (Array[T]) => T
    _randomOneOf: (agents) ->
      if agents.length is 0
        Nobody
      else
        agents[@_world.rng.nextInt(agents.length)]

    # (Number, (Number, Number) => Boolean, () => Number) => Array[T]
    _findBestOf: (worstPossible, findIsBetter, f) ->
      foldFunc =
        ([currentBest, currentWinners], agent) =>

          result = @_world.selfManager.askAgent(f)(agent)

          if result is currentBest
            currentWinners.push(agent)
            [currentBest, currentWinners]
          else if checks.isNumber(result) and findIsBetter(result, currentBest)
            [result, [agent]]
          else
            [currentBest, currentWinners]

      [[], winners] = foldl(foldFunc)([worstPossible, []])(@_unsafeIterator().toArray())
      winners

    # [U] @ (() => U) => Array[T]
    _findMaxesBy: (f) ->
      @_findBestOf(-Infinity, ((result, currentBest) -> result > currentBest), f)

    # [U] @ (() => U) => Array[T]
    _findMinsBy: (f) ->
      @_findBestOf(Infinity, ((result, currentBest) -> result < currentBest), f)

    # (Array[T]) => This[T]
    _generateFrom: (newAgentArr) ->
      new @constructor(newAgentArr, @_world)

    # (() => Boolean) => AgentSet
    _optimalOtherWith: (f) ->
      self = @_world.selfManager.self()
      filterer =
        (x) ->
          if x isnt self
            Iterator.boolOrError(x, x.projectionBy(f))
          else
            false
      @copyWithNewAgents(@_unsafeIterator().filter(filterer))

    # (() => Boolean) => Agent
    _optimalOneOfWith: (f) ->
      finder =
        (x) ->
          y = Iterator.boolOrError(x, x.projectionBy(f))
      @shufflerator().find(finder, Nobody)

    # (() => Boolean) => Boolean
    _optimalAnyWith: (f) ->
      @exists(@_world.selfManager.askAgent(f))

    # (() => Boolean) => Boolean
    _optimalAnyOtherWith: (f) ->
      self = @_world.selfManager.self()
      checker = (x) -> x isnt self and Iterator.boolOrError(x, x.projectionBy(f))
      @exists(checker)

    # (() => Boolean) => Number
    _optimalCountOtherWith: (f) ->
      self = @_world.selfManager.self()
      filterer = (x) -> x isnt self and Iterator.boolOrError(x, x.projectionBy(f))
      @_unsafeIterator().filter(filterer).length

    # (() => Boolean) => Number
    _optimalCountWith: (f) ->
      self = @_world.selfManager.self()
      filterer = (x) -> Iterator.boolOrError(x, x.projectionBy(f))
      @_unsafeIterator().filter(filterer).length

    # (Number, (Number, Number) => Boolean) => Boolean
    _optimalCheckCount: (n, operator) ->
      @_unsafeIterator().checkCount(n, operator)
