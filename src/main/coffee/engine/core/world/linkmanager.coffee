# (C) Uri Wilensky. https://github.com/NetLogo/Tortoise

# As far as dependencies and private access go, I'm treating this as if it's a part of `World` --JAB (8/5/14)

define(['engine/core/link', 'engine/core/linkset', 'engine/core/nobody', 'engine/core/structure/builtins'
      , 'engine/core/world/idmanager', 'engine/core/world/sortedlinks']
     , ( Link,               LinkSet,               Nobody,               Builtins
      ,  IDManager,                     SortedLinks) ->

  _links:         undefined # SortedLinks
  _linksFrom:     undefined # Object[Number, Number]
  _linkIDManager: undefined # IDManager
  _linksTo:       undefined # Object[Number, Number]

  class LinkManager

    # (World, BreedManager, Updater, () => Unit, () => Unit) => LinkManager
    constructor: (@_world, @_breedManager, @_updater, @_notifyIsDirected, @_notifyIsUndirected) ->
      @_links         = new SortedLinks
      @_linksFrom     = {}
      @_linkIDManager = new IDManager
      @_linksTo       = {}

    # (Turtle, Turtle) => Link
    createDirectedLink: (from, to) ->
      @_notifyIsDirected()
      @_createLink(true, from, to)

    # (Turtle, TurtleSet) => LinkSet
    createDirectedLinks: (source, others) ->
      @_notifyIsDirected()
      @_createLinksBy((turtle) => @_createLink(true, source, turtle))(others)

    # (Turtle, TurtleSet) => LinkSet
    createReverseDirectedLinks: (source, others) ->
      @_notifyIsDirected()
      @_createLinksBy((turtle) => @_createLink(true, turtle, source))(others)

    # (Turtle, Turtle) => Link
    createUndirectedLink: (source, other) ->
      @_createLink(false, source, other)

    # (Turtle, TurtleSet) => LinkSet
    createUndirectedLinks: (source, others) ->
      @_createLinksBy((turtle) => @_createLink(false, source, turtle))(others)

    # (Number, Number) => Agent
    getLink: (fromId, toId) ->
      link = @_links.find((link) -> link.end1.id is fromId and link.end2.id is toId)
      if link?
        link
      else
        Nobody

    # () => LinkSet
    links: ->
      new LinkSet(@_links.toArray())

    # (String) => LinkSet
    _linksOfBreed: (breedName) =>
      breed = @_breedManager.get(breedName)
      new LinkSet(breed.members, breedName)

    # (Link) => Unit
    _removeLink: (link) =>
      l = @_links.find((l) -> l.id is link.id)
      @_links = @_links.remove(l)
      if @_links.isEmpty() then @_notifyIsUndirected()

      remove = (set, id1, id2) -> set[id1] = _(set[id1]).without(id2).value()
      remove(@_linksFrom, link.end1.id, link.end2.id)
      if not link.isDirected then remove(@_linksTo, link.end2.id, link.end1.id)

      return

    # () => Unit
    _resetIDs: ->
      @_linkIDManager.reset()

    # (Boolean, Turtle, Turtle) => Link
    _createLink: (isDirected, from, to) ->
      [end1, end2] =
        if from.id < to.id or isDirected
          [from, to]
        else
          [to, from]

      if not @_linkExists(end1.id, end2.id, isDirected)
        link = new Link(@_linkIDManager.next(), isDirected, end1, end2, @_world, @_updater.updated, @_updater.registerDeadLink, @_removeLink, @_linksOfBreed)
        @_updater.updated(link)(Builtins.linkBuiltins...)
        @_updater.updated(link)(Builtins.linkExtras...)
        @_links.insert(link)
        @_insertIntoSets(end1.id, end2.id, isDirected)
        link
      else
        Nobody

    # ((Turtle) => Link) => (TurtleSet) => LinkSet
    _createLinksBy: (mkLink) -> (turtles) ->
      isLink = (other) -> other isnt Nobody
      links  = turtles.toArray().map(mkLink).filter(isLink)
      new LinkSet(links)

    # (Number, Number, Boolean) => Unit
    _insertIntoSets: (fromID, toID, isDirected) ->
      insertIntoSet =
        (set, id1, id2) ->
          neighbors = set[id1]
          if neighbors?
            neighbors.push(id2)
          else
            set[id1] = [id2]
      insertIntoSet(@_linksFrom, fromID, toID)
      if not isDirected then insertIntoSet(@_linksTo, toID, fromID)
      return

    # (Number, Number, Boolean) => Boolean
    _linkExists: (id1, id2, isDirected) ->
      _(@_linksFrom[id1]).contains(id2) or (not isDirected and _(@_linksTo[id1]).contains(id2))

)
