var AgentModel = tortoise_require('agentmodel');
var ColorModel = tortoise_require('engine/core/colormodel');
var Errors = tortoise_require('util/errors');
var Exception = tortoise_require('util/exception');
var Link = tortoise_require('engine/core/link');
var LinkSet = tortoise_require('engine/core/linkset');
var Meta = tortoise_require('meta');
var NLMath = tortoise_require('util/nlmath');
var NLType = tortoise_require('engine/core/typechecker');
var PatchSet = tortoise_require('engine/core/patchset');
var PenBundle = tortoise_require('engine/plot/pen');
var Plot = tortoise_require('engine/plot/plot');
var PlotOps = tortoise_require('engine/plot/plotops');
var Random = tortoise_require('shim/random');
var StrictMath = tortoise_require('shim/strictmath');
var Tasks = tortoise_require('engine/prim/tasks');
var Turtle = tortoise_require('engine/core/turtle');
var TurtleSet = tortoise_require('engine/core/turtleset');
var notImplemented = tortoise_require('util/notimplemented');

var linkShapes = {"default":{"name":"default","direction-indicator":{"name":"link direction","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":150,"x2":90,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":150,"x2":210,"y2":180,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"curviness":0,"lines":[{"x-offset":-0.2,"is-visible":false,"dash-pattern":[0,1]},{"x-offset":0,"is-visible":true,"dash-pattern":[1,0]},{"x-offset":0.2,"is-visible":false,"dash-pattern":[0,1]}]}};
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":1,"y":1,"diam":298,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"vector":{"name":"vector","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":15,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"xcors":[120,150,180,120],"ycors":[30,0,30,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "particles", singular: "particle", varNames: ["speed", "mass"] }])([], [])('globals [   result ;; for benchmarking   tick-length               ;; how much simulation will pass in this step   box-edge                  ;; distance of box edge from axes   colliding-particles   sorted-colliding-particles   colliding-particle-1   colliding-particle-2   original-tick-length   last-view-update   manage-view-updates?   view-update-rate          ;; specifies the minimum amount of simulation time that must                             ;; pass before the view is updated ]  breed [ particles particle ]  particles-own [   speed   mass ]  ;;;;;;;;;;;;;;;;  to benchmark   random-seed 12345   reset-timer   setup   set manage-view-updates? false   repeat 3500 [ go ]   set result timer end  to setup   ca reset-ticks   set-default-shape particles \"circle\"   set manage-view-updates? true   set view-update-rate 0.2   set box-edge (max-pxcor - 1)   make-box   make-particles    ;; set variable tick length based on fastest particle.   If the fastest particle has a speed of 1,   ;; then tick-length is 1.  If the fastest particles has a speed of 10, then tick-length is 1/10.   set tick-length (1 / (ceiling max [speed] of particles))   set original-tick-length tick-length   set colliding-particle-1 nobody   set colliding-particle-2 nobody   rebuild-collision-list end  to rebuild-collision-list   set colliding-particles []   ask particles [check-for-wall-collision]   ask particles [check-for-particle-collision ] end   to go   ;;Since only collisions involving the particles that collided most recently could be affected,   ;;we filter those out of colliding-particles.  Then we recalculate all possible collisions for the   ;;particles that collided last.  The ifelse statement is necessary because colliding-particle-2   ;;can be either a particle or a string representing a wall.  If it is a wall, we don\'t want to   ;;invalidate all collisions involving that wall (because the wall\'s position wasn\'t affected, those   ;;collisions are still valid.   ifelse is-turtle? colliding-particle-2   [     set colliding-particles filter [ [collision] ->       item 1 collision != colliding-particle-1 and       item 2 collision != colliding-particle-1 and       item 1 collision != colliding-particle-2 and       item 2 collision != colliding-particle-2]     colliding-particles     ask colliding-particle-2 [check-for-wall-collision]     ask colliding-particle-2 [check-for-particle-collision]   ]   [     set colliding-particles filter [ [collision] ->       item 1 collision != colliding-particle-1 and       item 2 collision != colliding-particle-1]     colliding-particles   ]   if colliding-particle-1 != nobody [ask colliding-particle-1 [check-for-wall-collision]]   if colliding-particle-1 != nobody [ask colliding-particle-1 [check-for-particle-collision]]    sort-collisions   ask particles [ jump speed * tick-length ]   collide-winners   tick-advance tick-length    ;; flag that updates display only after enough simulation time has passed.   ;; the display-update-rate sets the minimum simulation time that must pass   ;; before updating the display.  This avoids many redisplays of the view for   ;; a series of small time steps in the simulation (which would make the view show   ;; what looks like particles slowing down as they get near multiple collision points)   if manage-view-updates? [     if (ticks - last-view-update) > view-update-rate     [ display       set last-view-update ticks ]       ] end  to-report convert-heading-x [heading-angle]   report sin heading-angle end  to-report convert-heading-y [heading-angle]   report cos heading-angle end   to check-for-particle-collision  ;; check-for-particle-collision is a particle procedure that determines the time it takes to the collision between ;; two particles (if one exists).  It solves for the time by representing the equations of motion for ;; distance, velocity, and time in a quadratic equation of the vector components of the relative velocities ;; and changes in position between the two particles and solves for the time until the next collision    let my-x xcor   let my-y ycor   let my-particle-size size   let my-x-speed (speed * convert-heading-x heading)   let my-y-speed (speed * convert-heading-y heading)    ask other particles   [           let dpx (xcor - my-x)   ;; relative distance between particles in the x direction          let dpy (ycor - my-y)    ;; relative distance between particles in the y direction          let x-speed (speed * convert-heading-x heading) ;; speed of other particle in the x direction          let y-speed (speed * convert-heading-y heading) ;; speed of other particle in the x direction          let dvx (x-speed - my-x-speed) ;; relative speed difference between particles in the x direction          let dvy (y-speed - my-y-speed) ;; relative speed difference between particles in the y direction          let sum-r (((my-particle-size) / 2 ) + (([size] of self) / 2 )) ;; sum of both particle radii            ;; To figure out what the difference in position (P1) between two particles at a future time (t) would be,         ;; one would need to know the current difference in position (P0) between the two particles         ;; and the current difference in the velocity (V0) between of the two particles.          ;; The equation that represents the relationship would be:   P1 = P0 + t * V0          ;; we want find when in time (t), P1 would be equal to the sum of both the particle\'s radii (sum-r).         ;; When P1 is equal to is equal to sum-r, the particles will just be touching each other at         ;; their edges  (a single point of contact).          ;; Therefore we are looking for when:   sum-r =  P0 + t * V0          ;; This equation is not a simple linear equation, since P0 and V0 should both have x and y components         ;;  in their two dimensional vector representation (calculated as dpx, dpy, and dvx, dvy).           ;; By squaring both sides of the equation, we get:     (sum-r) * (sum-r) =  (P0 + t * V0) * (P0 + t * V0)          ;;  When expanded gives:   (sum-r ^ 2) = (P0 ^ 2) + (t * PO * V0) + (t * PO * V0) + (t ^ 2 * VO ^ 2)          ;;  Which can be simplified to:    0 = (P0 ^ 2) - (sum-r ^ 2) + (2 * PO * V0) * t + (VO ^ 2) * t ^ 2          ;;  Below, we will let p-squared represent:   (P0 ^ 2) - (sum-r ^ 2)         ;;  and pv represent: (2 * PO * V0)         ;;  and v-squared represent: (VO ^ 2)          ;;  then the equation will simplify to:     0 = p-squared + pv * t + v-squared * t^2            let p-squared   ((dpx * dpx) + (dpy * dpy)) - (sum-r ^ 2)   ;; p-squared represents difference of the                                                                      ;; square of the radii and the square                                                                      ;; of the initial positions           let pv  (2 * ((dpx * dvx) + (dpy * dvy)))  ;;the vector product of the position times the velocity          let v-squared  ((dvx * dvx) + (dvy * dvy)) ;; the square of the difference in speeds                                                     ;; represented as the sum of the squares of the x-component                                                     ;; and y-component of relative speeds between the two particles            ;; p-squared, pv, and v-squared are coefficients in the quadratic equation shown above that          ;; represents how distance between the particles and relative velocity are related to the time,          ;; t, at which they will next collide (or when their edges will just be touching)           ;; Any quadratic equation that is the function of time (t), can represented in a general form as:          ;;   a*t*t + b*t + c = 0,          ;; where a, b, and c are the coefficients of the three different terms, and has solutions for t          ;; that can be found by using the quadratic formula.  The quadratic formula states that if a is not 0,          ;; then there are two solutions for t, either real or complex.           ;; t is equal to (b +/- sqrt (b^2 - 4*a*c)) / 2*a           ;; the portion of this equation that is under a square root is referred to here          ;; as the determinant, D1.   D1 is equal to (b^2 - 4*a*c)          ;; and:   a = v-squared, b = pv, and c = p-squared.            let D1 pv ^ 2 -  (4 * v-squared * p-squared)            ;; the next line next line tells us that a collision will happen in the future if          ;; the determinant, D1 is >= 0,  since a positive determinant tells us that there is a          ;; real solution for the quadratic equation.  Quadratic equations can have solutions          ;; that are not real (they are square roots of negative numbers).  These are referred          ;; to as imaginary numbers and for many real world systems that the equations represent          ;; are not real world states the system can actually end up in.           ;; Once we determine that a real solution exists, we want to take only one of the two          ;; possible solutions to the quadratic equation, namely the smaller of the two the solutions:           ;;  (b - sqrt (b^2 - 4*a*c)) / 2*a          ;;  which is a solution that represents when the particles first touching on their edges.           ;;  instead of (b + sqrt (b^2 - 4*a*c)) / 2*a          ;;  which is a solution that represents a time after the particles have penetrated          ;;  and are coming back out of each other and when they are just touching on their edges.            let time-to-collision  -1           if D1 >= 0             [set time-to-collision (- pv - sqrt D1) / (2 * v-squared) ]        ;;solution for time step            ;; if time-to-collision is still -1 there is no collision in the future - no valid solution          ;; note:  negative values for time-to-collision represent where particles would collide          ;; if allowed to move backward in time.          ;; if time-to-collision is greater than 1, then we continue to advance the motion          ;; of the particles along their current trajectories.  They do not collide yet.           if time-to-collision > 0              [              ;; time-to-collision is relative (ie, a collision will occur one second from now)              ;; We need to store the absolute time (ie, a collision will occur at time 48.5 seconds.              ;; So, we add clock to time-to-collision when we store it.               let colliding-pair (list (time-to-collision + ticks) self myself) ;; sets a three element list of                                                         ;; time to collision and the colliding pair               set colliding-particles fput colliding-pair colliding-particles  ;; adds above list to collection                                                                                ;; of colliding pairs and time                                                                                ;; steps              ]   ]  end   to check-for-wall-collision ;; particle procedure for determining if a particle will hit one of the                             ;; four walls of the box    let x-speed (speed * convert-heading-x heading)   let y-speed (speed * convert-heading-y heading)   let xpos-plane (box-edge - 0.5)      ;;inside boundary of right side of the box   let xneg-plane (- box-edge + 0.5)    ;;inside boundary of left side of the box   let ypos-plane (box-edge - 0.5)      ;;inside boundary of top side of the box   let yneg-plane (- box-edge + 0.5)    ;;inside boundary of bottom side of the box    ;; find point of contact on edge of circle   ;; points of contact located at 1 radius above, below, to the left, and to the right   ;; of the center of the particle    let contact-point-xpos (xcor + (size / 2))   let contact-point-xneg (xcor - (size / 2))   let contact-point-ypos (ycor + (size / 2))   let contact-point-yneg (ycor - (size / 2))    ;; find difference in position between plane location and edge of circle    let dpxpos (xpos-plane - contact-point-xpos)   let dpxneg (xneg-plane - contact-point-xneg)   let dpypos (ypos-plane - contact-point-ypos)   let dpyneg (yneg-plane - contact-point-yneg)    let t-plane-xpos 0    ;; solve for the time it will take the particle to reach the wall by taking   ;; the distance to the wall and dividing it by the speed in the direction to the wall    ifelse  x-speed != 0 [set t-plane-xpos (dpxpos / x-speed)] [set t-plane-xpos 0]    if t-plane-xpos > 0       [        assign-colliding-wall t-plane-xpos \"plane-xpos\"       ]    let t-plane-xneg 0   ifelse  x-speed != 0 [set t-plane-xneg (dpxneg / x-speed)] [set t-plane-xneg 0]    if t-plane-xneg > 0       [        assign-colliding-wall t-plane-xneg \"plane-xneg\"       ]   let t-plane-ypos 0   ifelse  y-speed != 0 [set t-plane-ypos (dpypos / y-speed)] [set t-plane-ypos 0]    if t-plane-ypos > 0       [        assign-colliding-wall t-plane-ypos \"plane-ypos\"       ]    let t-plane-yneg 0   ifelse  y-speed != 0 [set t-plane-yneg (dpyneg / y-speed)] [set t-plane-yneg 0]   if t-plane-yneg > 0       [        assign-colliding-wall t-plane-yneg \"plane-yneg\"       ]  end  to assign-colliding-wall [time-to-collision wall]   ;; this procedure is used by the check-for-wall-collision procedure   ;; to assemble the correct particle-wall pair   ;; time-to-collision is relative (ie, a collision will occur one second from now)   ;; We need to store the absolute time (ie, a collision will occur at time 48.5 seconds.   ;; So, we add clock to time-to-collision when we store it.    let colliding-pair (list (time-to-collision + ticks) self wall)   set colliding-particles fput colliding-pair colliding-particles  end   to sort-collisions   ;; Slight errors in floating point math can cause a collision that just   ;; happened to be calculated as happening again a very tiny amount of   ;; time into the future, so we remove any collisions that involves   ;; the same two particles (or particle and wall) as last time.   set colliding-particles filter [ [collision] ->     item 1 collision != colliding-particle-1 or     item 2 collision != colliding-particle-2]   colliding-particles   set colliding-particle-1 nobody   set colliding-particle-2 nobody   set tick-length original-tick-length   if colliding-particles = [] [ stop ]   ;; Sort the list of projected collisions between all the particles into an ordered list.   ;; Take the smallest time-step from the list (which represents the next collision that will   ;; happen in time).  Use this time step as the tick-length for all the particles to move through   let winner first colliding-particles   foreach colliding-particles [ [collision] -> if first collision < first winner [set winner collision]]   ;;winner is now the collision that will occur next   let dt item 0 winner   if dt > 0   [     ;;If the next collision is more than 1 in the future,     ;;clear the winners and advance the simulation one tick.     ;;This helps smooth the model on smaller particle counts.     ifelse dt - ticks <= 1     ;;We have to subtract clock back out because now we want the relative time until collision,     ;;not the absolute time the collision will occur.     [set tick-length dt - ticks      set colliding-particle-1 item 1 winner      set colliding-particle-2 item 2 winner]     ;;Since there are no collisions in the next second, we will set winners to [] to keep from     ;;mistakenly colliding any particles that shouldn\'t collide yet.     [set tick-length 1]   ] end   to collide-winners  ;; deal with 3 possible cases of collisions:                     ;; particle and one wall, particle and two walls, and two particles     if colliding-particle-1 = nobody [ stop ]     ;; deal with a case where the next collision in time is between a particle and a wall      if colliding-particle-2 = \"plane-xpos\" or colliding-particle-2 = \"plane-xneg\"          [ask colliding-particle-1 [set heading (- heading)]           stop]     if colliding-particle-2 = \"plane-ypos\" or colliding-particle-2 = \"plane-yneg\"          [ask colliding-particle-1 [set heading (180 - heading)]           stop]      ;; deal with the remaining case of the next collision in time being between two particles.      ask colliding-particle-1 [collide-with colliding-particle-2]  end   to collide-with [ other-particle ] ;; particle procedure    ;;; PHASE 1: initial setup      ;; for convenience, grab some quantities from other-particle     let mass2 [mass] of other-particle     let speed2 [speed] of other-particle     let heading2 [heading] of other-particle    ;;modified so that theta is heading toward other particle   let theta towards other-particle    ;;; PHASE 2: convert velocities to theta-based vector representation    ;; now convert my velocity from speed/heading representation to components   ;; along theta and perpendicular to theta   let v1t (speed * cos (theta - heading))   let v1l (speed * sin (theta - heading))    ;; do the same for other-particle   let v2t (speed2 * cos (theta - heading2))   let v2l (speed2 * sin (theta - heading2))    ;;; PHASE 3: manipulate vectors to implement collision    ;; compute the velocity of the system\'s center of mass along theta   let vcm (((mass * v1t) + (mass2 * v2t)) / (mass + mass2) )    ;; now compute the new velocity for each particle along direction theta.   ;; velocity perpendicular to theta is unaffected by a collision along theta,   ;; so the next two lines actually implement the collision itself, in the   ;; sense that the effects of the collision are exactly the following changes   ;; in particle velocity.   set v1t (2 * vcm - v1t)   set v2t (2 * vcm - v2t)     ;;; PHASE 4: convert back to normal speed/heading    ;; now convert my velocity vector into my new speed and heading   set speed sqrt ((v1t * v1t) + (v1l * v1l))   ;; if the magnitude of the velocity vector is 0, atan is undefined. but   ;; speed will be 0, so heading is irrelevant anyway. therefore, in that   ;; case we\'ll just leave it unmodified.   if v1l != 0 or v1t != 0     [ set heading (theta - (atan v1l v1t)) ]    ;; and do the same for other-particle   ask other-particle [ set speed sqrt (((v2t * v2t) + (v2l * v2l))) ]   if v2l != 0 or v2t != 0     [ ask other-particle [ set heading (theta - (atan v2l v2t)) ] ]    ;; PHASE 5: final updates    ;; now recolor, since color is based on quantities that may have changed   recolor ask other-particle [ recolor ] end   to recolor     if color-scheme = \"red-green-blue\" [ recolor-banded ]     if color-scheme = \"blue shades\" [ recolor-shaded ]     if color-scheme  = \"one color\" [ recolor-none ] end   to recolor-banded  ;; particle procedure   let avg-speed 1   ;; avg-speed is assumed to be 0.5, since particles are assigned a random speed between 0 and 1   ;; particle coloring procedures for visualizing speed with a color palette,   ;; red are fast particles, blue slow, and green in between.    ifelse speed < (0.5 * avg-speed) ;; at lower than 50% the average speed   [     set color blue       ;; slow particles colored blue   ]   [     ifelse speed > (1.5 * avg-speed) ;; above 50% higher the average speed       [ set color red ]        ;; fast particles colored blue       [ set color green ]      ;; medium speed particles colored green   ]  end   to recolor-shaded   let avg-speed 1  ;; avg-speed is assumed to be 0.5, since particles are assigned a random speed between 0 and 1  ;; a particle shading gradient is applied to all particles less than speed 1.5,  ;; the uppermost threshold speed to apply the shading gradient to.    ifelse speed < (3 * avg-speed)   [ set color (sky - 3.001) + (8 * speed / (3 * avg-speed)) ]   [ set color (sky + 4.999)] end  to recolor-none   set color green - 1 end   ;;; ;;; drawing procedures ;;;  to make-box   ask patches with [ ((abs pxcor = box-edge) and (abs pycor <= box-edge)) or                      ((abs pycor = box-edge) and (abs pxcor <= box-edge)) ]     [ set pcolor yellow ] end  ;; creates some particles to make-particles   create-ordered-particles number [     set speed 1     set size smallest-particle-size + random-float (largest-particle-size - smallest-particle-size)     set mass (size * size) ;; set the mass proportional to the area of the particle     recolor     set heading random-float 360   ]   arrange particles end  ;; If the number of particles requested by the user won\'t fit in the box, ;; this code will go into an infinite loop. To work around a NetLogo bug ;; where some kinds of infinite loops cannot be halted by Tools->Halt, ;; we put this code in a separate procedure and write it a certain way. ;; (It\'s necessary for the loop not to be within an ASK.  The reason ;; for this is very obscure.  We plan to fix the problem in a future ;; NetLogo version.) to arrange [particle-set]   if not any? particle-set [ stop ]   ask particle-set [ random-position ]   arrange particle-set with [overlapping?] end  to-report overlapping?  ;; particle procedure   ;; here, we use in-radius just for improved speed   report any? other particles in-radius ((size + largest-particle-size) / 2)                               with [distance myself < (size + [size] of myself) / 2] end  ;; place particle at random location inside the box. to random-position  ;; particle procedure   setxy one-of [1 -1] * random-float (box-edge - 0.5 - size / 2)         one-of [1 -1] * random-float (box-edge - 0.5 - size / 2) end   ;;; ;;; procedure for reversing time ;;;  to reverse-time   ask particles [ rt 180 ]   rebuild-collision-list   ;; the last collision that happened before the model was paused   ;; (if the model was paused immediately after a collision)   ;; won\'t happen again after time is reversed because of the   ;; \"don\'t do the same collision twice in a row\" rule.  We could   ;; try to fool that rule by setting colliding-particle-1 and   ;; colliding-particle-2 to nobody, but that might not always work,   ;; because the vagaries of floating point math means that the   ;; collision might be calculated to be slightly in the past   ;; (the past that used to be the future!) and be skipped.   ;; So to be sure, we force the collision to happen:   collide-winners end  ;; Here\'s a procedure that demonstrates time-reversing the model. ;; You can run it from the command center.  When it finishes, ;; the final particle positions may be slightly different because ;; the amount of time that passes after the reversal might not ;; be exactly the same as the amount that passed before; this ;; doesn\'t indicate a bug in the model. ;; For larger values of n, you will start to notice larger ;; discrepancies, eventually causing the behavior of the system ;; to diverge totally. Unless the model has some bug we don\'t know ;; about, this is due to accumulating tiny inaccuracies in the ;; floating point calculations.  Once these inaccuracies accumulate ;; to the point that a collision is missed or an extra collision ;; happens, after that the reversed model will diverge rapidly. to test-time-reversal [n]   setup   ask particles [ stamp ]   while [ticks < n] [ go ]   let old-clock ticks   reverse-time   while [ticks < 2 * old-clock] [ go ]   ask particles [ set color white ] end')([{"left":212,"top":10,"right":706,"bottom":505,"dimensions":{"minPxcor":-40,"maxPxcor":40,"minPycor":-40,"maxPycor":40,"patchSize":6,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":20,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":13,"top":172,"right":106,"bottom":205,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"200","compiledStep":"1","variable":"number","left":10,"top":38,"right":199,"bottom":71,"display":"number","min":"1","max":"200","default":200,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":112,"top":172,"right":199,"bottom":205,"forever":true,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"10","compiledStep":"0.5","variable":"largest-particle-size","left":10,"top":117,"right":198,"bottom":150,"display":"largest-particle-size","min":"1","max":"10","default":4,"step":"0.5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"variable":"color-scheme","left":14,"top":226,"right":145,"bottom":271,"display":"color-scheme","choices":["red-green-blue","blue shades","one color"],"currentChoice":0,"type":"chooser","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"5","compiledStep":"0.5","variable":"smallest-particle-size","left":10,"top":77,"right":198,"bottom":110,"display":"smallest-particle-size","min":"1","max":"5","default":1,"step":"0.5","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_42 = procedures[\"BENCHMARK\"]();   if (_maybestop_33_42 instanceof Exception.StopInterrupt) { return _maybestop_33_42; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"benchmark","left":23,"top":359,"right":200,"bottom":504,"forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"result\")","source":"result","left":32,"top":455,"right":190,"bottom":500,"precision":17,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["number", "largest-particle-size", "color-scheme", "smallest-particle-size", "result", "tick-length", "box-edge", "colliding-particles", "sorted-colliding-particles", "colliding-particle-1", "colliding-particle-2", "original-tick-length", "last-view-update", "manage-view-updates?", "view-update-rate"], ["number", "largest-particle-size", "color-scheme", "smallest-particle-size"], [], -40, 40, -40, 40, 6, false, false, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
var BreedManager = workspace.breedManager;
var ImportExportPrims = workspace.importExportPrims;
var InspectionPrims = workspace.inspectionPrims;
var LayoutManager = workspace.layoutManager;
var LinkPrims = workspace.linkPrims;
var ListPrims = workspace.listPrims;
var MousePrims = workspace.mousePrims;
var OutputPrims = workspace.outputPrims;
var PrimChecks = workspace.primChecks;
var Prims = workspace.prims;
var PrintPrims = workspace.printPrims;
var RandomPrims = workspace.randomPrims;
var SelfManager = workspace.selfManager;
var SelfPrims = workspace.selfPrims;
var Updater = workspace.updater;
var UserDialogPrims = workspace.userDialogPrims;
var plotManager = workspace.plotManager;
var world = workspace.world;
var procedures = (function() {
  var procs = {};
  var temp = undefined;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      PrimChecks.math.randomSeed(12345);
      workspace.timer.reset();
      procedures["SETUP"]();
      world.observer.setGlobal("manage-view-updates?", false);
      for (let _index_664_670 = 0, _repeatcount_664_670 = StrictMath.floor(3500); _index_664_670 < _repeatcount_664_670; _index_664_670++){
        procedures["GO"]();
      }
      world.observer.setGlobal("result", workspace.timer.elapsed());
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["benchmark"] = temp;
  procs["BENCHMARK"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.clearAll();
      world.ticker.reset();
      BreedManager.setDefaultShape(world.turtleManager.turtlesOfBreed("PARTICLES").getSpecialName(), "circle")
      world.observer.setGlobal("manage-view-updates?", true);
      world.observer.setGlobal("view-update-rate", 0.2);
      world.observer.setGlobal("box-edge", (world.topology.maxPxcor - 1));
      procedures["MAKE-BOX"]();
      procedures["MAKE-PARTICLES"]();
      world.observer.setGlobal("tick-length", PrimChecks.math.div(1, PrimChecks.math.ceil(PrimChecks.list.max(world.turtleManager.turtlesOfBreed("PARTICLES").projectionBy(function() { return SelfManager.self().getVariable("speed"); })))));
      world.observer.setGlobal("original-tick-length", world.observer.getGlobal("tick-length"));
      world.observer.setGlobal("colliding-particle-1", Nobody);
      world.observer.setGlobal("colliding-particle-2", Nobody);
      procedures["REBUILD-COLLISION-LIST"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setup"] = temp;
  procs["SETUP"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("colliding-particles", []);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["rebuildCollisionList"] = temp;
  procs["REBUILD-COLLISION-LIST"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (NLType.checks.isValidTurtle(world.observer.getGlobal("colliding-particle-2"))) {
        world.observer.setGlobal("colliding-particles", PrimChecks.list.filter(Tasks.reporterTask(function(collision) {
          Errors.procedureArgumentsCheck(1, arguments.length);
          return (((!Prims.equality(PrimChecks.list.item(1, collision), world.observer.getGlobal("colliding-particle-1")) && !Prims.equality(PrimChecks.list.item(2, collision), world.observer.getGlobal("colliding-particle-1"))) && !Prims.equality(PrimChecks.list.item(1, collision), world.observer.getGlobal("colliding-particle-2"))) && !Prims.equality(PrimChecks.list.item(2, collision), world.observer.getGlobal("colliding-particle-2")));
        }, "[ [collision] -> item 1 collision != colliding-particle-1 and item 2 collision != colliding-particle-1 and item 1 collision != colliding-particle-2 and item 2 collision != colliding-particle-2 ]"), world.observer.getGlobal("colliding-particles")));
        Errors.askNobodyCheck(world.observer.getGlobal("colliding-particle-2")).ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
        Errors.askNobodyCheck(world.observer.getGlobal("colliding-particle-2")).ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
      }
      else {
        world.observer.setGlobal("colliding-particles", PrimChecks.list.filter(Tasks.reporterTask(function(collision) {
          Errors.procedureArgumentsCheck(1, arguments.length);
          return (!Prims.equality(PrimChecks.list.item(1, collision), world.observer.getGlobal("colliding-particle-1")) && !Prims.equality(PrimChecks.list.item(2, collision), world.observer.getGlobal("colliding-particle-1")));
        }, "[ [collision] -> item 1 collision != colliding-particle-1 and item 2 collision != colliding-particle-1 ]"), world.observer.getGlobal("colliding-particles")));
      }
      if (!Prims.equality(world.observer.getGlobal("colliding-particle-1"), Nobody)) {
        Errors.askNobodyCheck(world.observer.getGlobal("colliding-particle-1")).ask(function() { procedures["CHECK-FOR-WALL-COLLISION"](); }, true);
      }
      if (!Prims.equality(world.observer.getGlobal("colliding-particle-1"), Nobody)) {
        Errors.askNobodyCheck(world.observer.getGlobal("colliding-particle-1")).ask(function() { procedures["CHECK-FOR-PARTICLE-COLLISION"](); }, true);
      }
      procedures["SORT-COLLISIONS"]();
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() {
        SelfManager.self().jumpIfAble((SelfManager.self().getVariable("speed") * world.observer.getGlobal("tick-length")));
      }, true);
      procedures["COLLIDE-WINNERS"]();
      world.ticker.tickAdvance(world.observer.getGlobal("tick-length"));
      if (world.observer.getGlobal("manage-view-updates?")) {
        if (Prims.gt((world.ticker.tickCount() - world.observer.getGlobal("last-view-update")), world.observer.getGlobal("view-update-rate"))) {
          notImplemented('display', undefined)();
          world.observer.setGlobal("last-view-update", world.ticker.tickCount());
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function(headingAngle) {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.sin(headingAngle);
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["convertHeadingX"] = temp;
  procs["CONVERT-HEADING-X"] = temp;
  temp = (function(headingAngle) {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return PrimChecks.math.cos(headingAngle);
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["convertHeadingY"] = temp;
  procs["CONVERT-HEADING-Y"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let myX = SelfManager.self().getVariable("xcor"); letVars['myX'] = myX;
      let myY = SelfManager.self().getVariable("ycor"); letVars['myY'] = myY;
      let myParticleSize = SelfManager.self().getVariable("size"); letVars['myParticleSize'] = myParticleSize;
      let myXSpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-X"](SelfManager.self().getVariable("heading"))); letVars['myXSpeed'] = myXSpeed;
      let myYSpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-Y"](SelfManager.self().getVariable("heading"))); letVars['myYSpeed'] = myYSpeed;
      Errors.askNobodyCheck(SelfPrims.other(world.turtleManager.turtlesOfBreed("PARTICLES"))).ask(function() {
        let dpx = (SelfManager.self().getVariable("xcor") - myX); letVars['dpx'] = dpx;
        let dpy = (SelfManager.self().getVariable("ycor") - myY); letVars['dpy'] = dpy;
        let xSpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-X"](SelfManager.self().getVariable("heading"))); letVars['xSpeed'] = xSpeed;
        let ySpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-Y"](SelfManager.self().getVariable("heading"))); letVars['ySpeed'] = ySpeed;
        let dvx = (xSpeed - myXSpeed); letVars['dvx'] = dvx;
        let dvy = (ySpeed - myYSpeed); letVars['dvy'] = dvy;
        let sumR = (PrimChecks.math.div(myParticleSize, 2) + PrimChecks.math.div(SelfManager.self().projectionBy(function() { return SelfManager.self().getVariable("size"); }), 2)); letVars['sumR'] = sumR;
        let pSquared = (((dpx * dpx) + (dpy * dpy)) - PrimChecks.math.pow(sumR, 2)); letVars['pSquared'] = pSquared;
        let pv = (2 * ((dpx * dvx) + (dpy * dvy))); letVars['pv'] = pv;
        let vSquared = ((dvx * dvx) + (dvy * dvy)); letVars['vSquared'] = vSquared;
        let d1 = (PrimChecks.math.pow(pv, 2) - ((4 * vSquared) * pSquared)); letVars['d1'] = d1;
        let timeToCollision = -1; letVars['timeToCollision'] = timeToCollision;
        if (Prims.gte(d1, 0)) {
          timeToCollision = PrimChecks.math.div(( -(pv) - PrimChecks.math.sqrt(d1)), (2 * vSquared)); letVars['timeToCollision'] = timeToCollision;
        }
        if (Prims.gt(timeToCollision, 0)) {
          let collidingPair = ListPrims.list((timeToCollision + world.ticker.tickCount()), SelfManager.self(), SelfManager.myself()); letVars['collidingPair'] = collidingPair;
          world.observer.setGlobal("colliding-particles", PrimChecks.list.fput(collidingPair, world.observer.getGlobal("colliding-particles")));
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["checkForParticleCollision"] = temp;
  procs["CHECK-FOR-PARTICLE-COLLISION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let xSpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-X"](SelfManager.self().getVariable("heading"))); letVars['xSpeed'] = xSpeed;
      let ySpeed = (SelfManager.self().getVariable("speed") * procedures["CONVERT-HEADING-Y"](SelfManager.self().getVariable("heading"))); letVars['ySpeed'] = ySpeed;
      let xposPlane = (world.observer.getGlobal("box-edge") - 0.5); letVars['xposPlane'] = xposPlane;
      let xnegPlane = ( -(world.observer.getGlobal("box-edge")) + 0.5); letVars['xnegPlane'] = xnegPlane;
      let yposPlane = (world.observer.getGlobal("box-edge") - 0.5); letVars['yposPlane'] = yposPlane;
      let ynegPlane = ( -(world.observer.getGlobal("box-edge")) + 0.5); letVars['ynegPlane'] = ynegPlane;
      let contactPointXpos = (SelfManager.self().getVariable("xcor") + PrimChecks.math.div(SelfManager.self().getVariable("size"), 2)); letVars['contactPointXpos'] = contactPointXpos;
      let contactPointXneg = (SelfManager.self().getVariable("xcor") - PrimChecks.math.div(SelfManager.self().getVariable("size"), 2)); letVars['contactPointXneg'] = contactPointXneg;
      let contactPointYpos = (SelfManager.self().getVariable("ycor") + PrimChecks.math.div(SelfManager.self().getVariable("size"), 2)); letVars['contactPointYpos'] = contactPointYpos;
      let contactPointYneg = (SelfManager.self().getVariable("ycor") - PrimChecks.math.div(SelfManager.self().getVariable("size"), 2)); letVars['contactPointYneg'] = contactPointYneg;
      let dpxpos = (xposPlane - contactPointXpos); letVars['dpxpos'] = dpxpos;
      let dpxneg = (xnegPlane - contactPointXneg); letVars['dpxneg'] = dpxneg;
      let dpypos = (yposPlane - contactPointYpos); letVars['dpypos'] = dpypos;
      let dpyneg = (ynegPlane - contactPointYneg); letVars['dpyneg'] = dpyneg;
      let tPlaneXpos = 0; letVars['tPlaneXpos'] = tPlaneXpos;
      if (!Prims.equality(xSpeed, 0)) {
        tPlaneXpos = PrimChecks.math.div(dpxpos, xSpeed); letVars['tPlaneXpos'] = tPlaneXpos;
      }
      else {
        tPlaneXpos = 0; letVars['tPlaneXpos'] = tPlaneXpos;
      }
      if (Prims.gt(tPlaneXpos, 0)) {
        procedures["ASSIGN-COLLIDING-WALL"](tPlaneXpos,"plane-xpos");
      }
      let tPlaneXneg = 0; letVars['tPlaneXneg'] = tPlaneXneg;
      if (!Prims.equality(xSpeed, 0)) {
        tPlaneXneg = PrimChecks.math.div(dpxneg, xSpeed); letVars['tPlaneXneg'] = tPlaneXneg;
      }
      else {
        tPlaneXneg = 0; letVars['tPlaneXneg'] = tPlaneXneg;
      }
      if (Prims.gt(tPlaneXneg, 0)) {
        procedures["ASSIGN-COLLIDING-WALL"](tPlaneXneg,"plane-xneg");
      }
      let tPlaneYpos = 0; letVars['tPlaneYpos'] = tPlaneYpos;
      if (!Prims.equality(ySpeed, 0)) {
        tPlaneYpos = PrimChecks.math.div(dpypos, ySpeed); letVars['tPlaneYpos'] = tPlaneYpos;
      }
      else {
        tPlaneYpos = 0; letVars['tPlaneYpos'] = tPlaneYpos;
      }
      if (Prims.gt(tPlaneYpos, 0)) {
        procedures["ASSIGN-COLLIDING-WALL"](tPlaneYpos,"plane-ypos");
      }
      let tPlaneYneg = 0; letVars['tPlaneYneg'] = tPlaneYneg;
      if (!Prims.equality(ySpeed, 0)) {
        tPlaneYneg = PrimChecks.math.div(dpyneg, ySpeed); letVars['tPlaneYneg'] = tPlaneYneg;
      }
      else {
        tPlaneYneg = 0; letVars['tPlaneYneg'] = tPlaneYneg;
      }
      if (Prims.gt(tPlaneYneg, 0)) {
        procedures["ASSIGN-COLLIDING-WALL"](tPlaneYneg,"plane-yneg");
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["checkForWallCollision"] = temp;
  procs["CHECK-FOR-WALL-COLLISION"] = temp;
  temp = (function(timeToCollision, wall) {
    try {
      var reporterContext = false;
      var letVars = { };
      let collidingPair = ListPrims.list((timeToCollision + world.ticker.tickCount()), SelfManager.self(), wall); letVars['collidingPair'] = collidingPair;
      world.observer.setGlobal("colliding-particles", PrimChecks.list.fput(collidingPair, world.observer.getGlobal("colliding-particles")));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["assignCollidingWall"] = temp;
  procs["ASSIGN-COLLIDING-WALL"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("colliding-particles", PrimChecks.list.filter(Tasks.reporterTask(function(collision) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        return (!Prims.equality(PrimChecks.list.item(1, collision), world.observer.getGlobal("colliding-particle-1")) || !Prims.equality(PrimChecks.list.item(2, collision), world.observer.getGlobal("colliding-particle-2")));
      }, "[ [collision] -> item 1 collision != colliding-particle-1 or item 2 collision != colliding-particle-2 ]"), world.observer.getGlobal("colliding-particles")));
      world.observer.setGlobal("colliding-particle-1", Nobody);
      world.observer.setGlobal("colliding-particle-2", Nobody);
      world.observer.setGlobal("tick-length", world.observer.getGlobal("original-tick-length"));
      if (Prims.equality(world.observer.getGlobal("colliding-particles"), [])) {
        throw new Exception.StopInterrupt;
      }
      let winner = PrimChecks.list.first(world.observer.getGlobal("colliding-particles")); letVars['winner'] = winner;
      var _foreach_14531_14538 = Tasks.forEach(Tasks.commandTask(function(collision) {
        Errors.procedureArgumentsCheck(1, arguments.length);
        if (Prims.lt(PrimChecks.list.first(collision), PrimChecks.list.first(winner))) {
          winner = collision; letVars['winner'] = winner;
        }
      }, "[ [collision] -> if first collision < first winner [ set winner collision ] ]"), world.observer.getGlobal("colliding-particles")); if(reporterContext && _foreach_14531_14538 !== undefined) { return _foreach_14531_14538; }
      let dt = PrimChecks.list.item(0, winner); letVars['dt'] = dt;
      if (Prims.gt(dt, 0)) {
        if (Prims.lte((dt - world.ticker.tickCount()), 1)) {
          world.observer.setGlobal("tick-length", (dt - world.ticker.tickCount()));
          world.observer.setGlobal("colliding-particle-1", PrimChecks.list.item(1, winner));
          world.observer.setGlobal("colliding-particle-2", PrimChecks.list.item(2, winner));
        }
        else {
          world.observer.setGlobal("tick-length", 1);
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["sortCollisions"] = temp;
  procs["SORT-COLLISIONS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("colliding-particle-1"), Nobody)) {
        throw new Exception.StopInterrupt;
      }
      if ((Prims.equality(world.observer.getGlobal("colliding-particle-2"), "plane-xpos") || Prims.equality(world.observer.getGlobal("colliding-particle-2"), "plane-xneg"))) {
        Errors.askNobodyCheck(world.observer.getGlobal("colliding-particle-1")).ask(function() { SelfManager.self().setVariable("heading",  -(SelfManager.self().getVariable("heading"))); }, true);
        throw new Exception.StopInterrupt;
      }
      if ((Prims.equality(world.observer.getGlobal("colliding-particle-2"), "plane-ypos") || Prims.equality(world.observer.getGlobal("colliding-particle-2"), "plane-yneg"))) {
        Errors.askNobodyCheck(world.observer.getGlobal("colliding-particle-1")).ask(function() { SelfManager.self().setVariable("heading", (180 - SelfManager.self().getVariable("heading"))); }, true);
        throw new Exception.StopInterrupt;
      }
      Errors.askNobodyCheck(world.observer.getGlobal("colliding-particle-1")).ask(function() { procedures["COLLIDE-WITH"](world.observer.getGlobal("colliding-particle-2")); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["collideWinners"] = temp;
  procs["COLLIDE-WINNERS"] = temp;
  temp = (function(otherParticle) {
    try {
      var reporterContext = false;
      var letVars = { };
      let mass2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("mass"); }); letVars['mass2'] = mass2;
      let speed2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("speed"); }); letVars['speed2'] = speed2;
      let heading2 = otherParticle.projectionBy(function() { return SelfManager.self().getVariable("heading"); }); letVars['heading2'] = heading2;
      let theta = SelfManager.self().towards(otherParticle); letVars['theta'] = theta;
      let v1t = (SelfManager.self().getVariable("speed") * PrimChecks.math.cos((theta - SelfManager.self().getVariable("heading")))); letVars['v1t'] = v1t;
      let v1l = (SelfManager.self().getVariable("speed") * PrimChecks.math.sin((theta - SelfManager.self().getVariable("heading")))); letVars['v1l'] = v1l;
      let v2t = (speed2 * PrimChecks.math.cos((theta - heading2))); letVars['v2t'] = v2t;
      let v2l = (speed2 * PrimChecks.math.sin((theta - heading2))); letVars['v2l'] = v2l;
      let vcm = PrimChecks.math.div(((SelfManager.self().getVariable("mass") * v1t) + (mass2 * v2t)), (SelfManager.self().getVariable("mass") + mass2)); letVars['vcm'] = vcm;
      v1t = ((2 * vcm) - v1t); letVars['v1t'] = v1t;
      v2t = ((2 * vcm) - v2t); letVars['v2t'] = v2t;
      SelfManager.self().setVariable("speed", PrimChecks.math.sqrt(((v1t * v1t) + (v1l * v1l))));
      if ((!Prims.equality(v1l, 0) || !Prims.equality(v1t, 0))) {
        SelfManager.self().setVariable("heading", (theta - PrimChecks.math.atan(v1l, v1t)));
      }
      Errors.askNobodyCheck(otherParticle).ask(function() { SelfManager.self().setVariable("speed", PrimChecks.math.sqrt(((v2t * v2t) + (v2l * v2l)))); }, true);
      if ((!Prims.equality(v2l, 0) || !Prims.equality(v2t, 0))) {
        Errors.askNobodyCheck(otherParticle).ask(function() { SelfManager.self().setVariable("heading", (theta - PrimChecks.math.atan(v2l, v2t))); }, true);
      }
      procedures["RECOLOR"]();
      Errors.askNobodyCheck(otherParticle).ask(function() { procedures["RECOLOR"](); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["collideWith"] = temp;
  procs["COLLIDE-WITH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(world.observer.getGlobal("color-scheme"), "red-green-blue")) {
        procedures["RECOLOR-BANDED"]();
      }
      if (Prims.equality(world.observer.getGlobal("color-scheme"), "blue shades")) {
        procedures["RECOLOR-SHADED"]();
      }
      if (Prims.equality(world.observer.getGlobal("color-scheme"), "one color")) {
        procedures["RECOLOR-NONE"]();
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["recolor"] = temp;
  procs["RECOLOR"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let avgSpeed = 1; letVars['avgSpeed'] = avgSpeed;
      if (Prims.lt(SelfManager.self().getVariable("speed"), (0.5 * avgSpeed))) {
        SelfManager.self().setVariable("color", 105);
      }
      else {
        if (Prims.gt(SelfManager.self().getVariable("speed"), (1.5 * avgSpeed))) {
          SelfManager.self().setVariable("color", 15);
        }
        else {
          SelfManager.self().setVariable("color", 55);
        }
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["recolorBanded"] = temp;
  procs["RECOLOR-BANDED"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let avgSpeed = 1; letVars['avgSpeed'] = avgSpeed;
      if (Prims.lt(SelfManager.self().getVariable("speed"), (3 * avgSpeed))) {
        SelfManager.self().setVariable("color", ((95 - 3.001) + PrimChecks.math.div((8 * SelfManager.self().getVariable("speed")), (3 * avgSpeed))));
      }
      else {
        SelfManager.self().setVariable("color", (95 + 4.999));
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["recolorShaded"] = temp;
  procs["RECOLOR-SHADED"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setVariable("color", (55 - 1));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["recolorNone"] = temp;
  procs["RECOLOR-NONE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.patches().agentFilter(function() {
        return ((Prims.equality(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge")) && Prims.lte(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge"))) || (Prims.equality(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pycor")), world.observer.getGlobal("box-edge")) && Prims.lte(PrimChecks.math.abs(SelfManager.self().getPatchVariable("pxcor")), world.observer.getGlobal("box-edge"))));
      })).ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeBox"] = temp;
  procs["MAKE-BOX"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.turtleManager.createOrderedTurtles(world.observer.getGlobal("number"), "PARTICLES").ask(function() {
        SelfManager.self().setVariable("speed", 1);
        SelfManager.self().setVariable("size", (world.observer.getGlobal("smallest-particle-size") + PrimChecks.math.randomFloat((world.observer.getGlobal("largest-particle-size") - world.observer.getGlobal("smallest-particle-size")))));
        SelfManager.self().setVariable("mass", (SelfManager.self().getVariable("size") * SelfManager.self().getVariable("size")));
        procedures["RECOLOR"]();
        SelfManager.self().setVariable("heading", PrimChecks.math.randomFloat(360));
      }, true);
      procedures["ARRANGE"](world.turtleManager.turtlesOfBreed("PARTICLES"));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["makeParticles"] = temp;
  procs["MAKE-PARTICLES"] = temp;
  temp = (function(particleSet) {
    try {
      var reporterContext = false;
      var letVars = { };
      if (!!particleSet.isEmpty()) {
        throw new Exception.StopInterrupt;
      }
      Errors.askNobodyCheck(particleSet).ask(function() { procedures["RANDOM-POSITION"](); }, true);
      procedures["ARRANGE"](particleSet.agentFilter(function() { return procedures["OVERLAPPING?"](); }));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["arrange"] = temp;
  procs["ARRANGE"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return SelfManager.self().inRadius(world.turtleManager.turtlesOfBreed("PARTICLES"), PrimChecks.math.div((SelfManager.self().getVariable("size") + world.observer.getGlobal("largest-particle-size")), 2))._optimalAnyOtherWith(function() {
        return Prims.lt(SelfManager.self().distance(SelfManager.myself()), PrimChecks.math.div((SelfManager.self().getVariable("size") + SelfManager.myself().projectionBy(function() { return SelfManager.self().getVariable("size"); })), 2));
      });
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["overlapping_p"] = temp;
  procs["OVERLAPPING?"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setXY((PrimChecks.list.oneOf([1, -1]) * PrimChecks.math.randomFloat(((world.observer.getGlobal("box-edge") - 0.5) - PrimChecks.math.div(SelfManager.self().getVariable("size"), 2)))), (PrimChecks.list.oneOf([1, -1]) * PrimChecks.math.randomFloat(((world.observer.getGlobal("box-edge") - 0.5) - PrimChecks.math.div(SelfManager.self().getVariable("size"), 2)))));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["randomPosition"] = temp;
  procs["RANDOM-POSITION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { SelfManager.self().right(180); }, true);
      procedures["REBUILD-COLLISION-LIST"]();
      procedures["COLLIDE-WINNERS"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["reverseTime"] = temp;
  procs["REVERSE-TIME"] = temp;
  temp = (function(n) {
    try {
      var reporterContext = false;
      var letVars = { };
      procedures["SETUP"]();
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { SelfManager.self().stamp(); }, true);
      while (Prims.lt(world.ticker.tickCount(), n)) {
        procedures["GO"]();
      }
      let oldClock = world.ticker.tickCount(); letVars['oldClock'] = oldClock;
      procedures["REVERSE-TIME"]();
      while (Prims.lt(world.ticker.tickCount(), (2 * oldClock))) {
        procedures["GO"]();
      }
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("PARTICLES")).ask(function() { SelfManager.self().setVariable("color", 9.9); }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["testTimeReversal"] = temp;
  procs["TEST-TIME-REVERSAL"] = temp;
  return procs;
})();
world.observer.setGlobal("number", 200);
world.observer.setGlobal("largest-particle-size", 4);
world.observer.setGlobal("color-scheme", "red-green-blue");
world.observer.setGlobal("smallest-particle-size", 1);