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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([])(["start-patch"], [])('turtles-own [start-patch] ;; original position of ball on kick line patches-own [score        ;; score for this position along the kick line              left-angle   ;; angle towards left goal-post              right-angle  ;; angle towards right goal-post              goal-angle   ;; size of arc between left-angle and right-angle              slope]       ;; slope of line from this patch towards a goal-post globals [current-max      ;; the best patch-score so far          col              ;; current color for our level-curves          ang              ;; viewing angle of the current level curve          best-dist        ;; distance from try-line of best kick          analytic         ;; what the best distance should be, analytically          try-line         ;; agentset containing only those patches on the try line          histogram-area   ;; agentset containing only patches inside the histogram          kicks            ;; total number of balls kicked          goals]           ;; total number of goals scored  ;; the origin of this model is set in the bottom left corner so ;; the y distance to the goal corresponds to the y-coordinate of the patch ;; this makes many of the calculations simpler.  to setup   clear-all   setup-field   setup-balls   set current-max 0   set best-dist -1   set kicks 0   ask try-line [ set score 0 ]   find-analytic-solution   if show-level-curves? [ draw-level-curves ]   reset-ticks end  to setup-field   ;; Draw lines for border, kick line, and goal line   ask patches [     if count neighbors != 8      [set pcolor red ]     if (pycor = min-pycor) and        (pxcor >= goal-pos) and        (pxcor < (goal-pos + goal-size))      [set pcolor green]   ]   set try-line patches with [ pxcor = kick-line and pcolor = black ]   ask try-line [ set pcolor yellow ]   set histogram-area patches with [ pxcor < kick-line and pcolor = black ] end  ;; turtle procedure that resets all balls to kick line at end of each round to setup-balls   set-default-shape turtles \"circle\"   ask try-line     [ sprout 1         [ set color orange           set start-patch patch-here           set heading (random-float 90) + 90 ] ]   plot-scores end  to go   while [any? turtles] [     ask turtles [ move ]     display   ]   set kicks kicks + count try-line   set goals sum [score] of try-line   setup-balls   tick end  ;; turtle procedure that moves all balls to move   ;; for speed, only check success/failure once we\'re near the   ;; edge of the playing field   if pxcor >= max-pxcor - 1 or pycor >= min-pycor + 1      [ ;; in this model we approximate continuous motion by making        ;; the turtles jump forward a step at a time.  but this can        ;; throw the results off a little because sometimes a ball        ;; will jump over the corner of a patch.  so to get correct        ;; results, we need to check two patches.  \"next-patch\" is        ;; the patch we would hit if we actually moved continuously.        ;; \"patch-ahead 1\" is the patch we\'re going to land on when        ;; we make our discrete jump.        check-patch next-patch        check-patch patch-ahead 1 ]   fd 1 end  to check-patch [the-patch]  ;; turtle procedure   if ([pcolor] of the-patch = red)     [ die ]       ;; the ball has hit the border wall   if ([pcolor] of the-patch = green) ;; the ball has reached the goal     [ ;; increment the number of times a goal has been scored from this point on the kick line       ask start-patch         [ set score score + 1 ]       die ] end  ;; see Next Patch Example, in the Code Examples section of ;; the Models Library, for a discussion of this code. to-report next-patch  ;; turtle procedure   if heading < towardsxy (pxcor + 0.5) (pycor + 0.5)     [ report patch-at 0 1 ]   if heading < towardsxy (pxcor + 0.5) (pycor - 0.5)     [ report patch-at 1 0 ]   if heading < towardsxy (pxcor - 0.5) (pycor - 0.5)     [ report patch-at 0 -1 ]   if heading < towardsxy (pxcor - 0.5) (pycor + 0.5)     [ report patch-at -1 0 ]   report patch-at 0 1 end  ;; do histogramming in the view to plot-scores   ;; set the maximum goals scored from any patch   set current-max (max [score] of try-line)   if current-max = 0   [     ask histogram-area [ set pcolor black ]     stop  ; otherwise we\'ll get division-by-zero errors below   ]   ask try-line [     ifelse score = current-max       [ set best-dist pycor         ask patch-at 2 0 [ set plabel pycor ] ]       [ if pcolor != magenta         [ ask patch-at 2 0 [ set plabel \"\" ] ] ]   ]   ask histogram-area   [;; make the histogram bar     ifelse  pxcor > (kick-line - (([score] of patch-at (kick-line - pxcor) 0) * (kick-line - min-pxcor) / current-max))     ;; make the yellow histogram bars at the maximal locations     [ifelse ([score] of patch-at (kick-line - pxcor) 0 = current-max)       [set pcolor yellow]       ;; other locations get blue bars       [set pcolor blue] ]     [set pcolor black]   ] end  to find-analytic-solution   ask patches with [pycor > min-pycor]     [ calc-goal-angle ]   ;; calculate the analytic solution for best kicking point   let winning-patch min-one-of try-line [goal-angle]   ask winning-patch   [ set pcolor magenta     ask patch-at 2 0 [ set plabel pycor ] ]   set analytic [ pycor ] of winning-patch end  to draw-level-curves   ask patches with [(pxcor > kick-line) and (pcolor < 10) ]     [ if goal-angle > 270       [ set pcolor (360 - goal-angle mod 10) * 0.8 ] ] end  ;; calculate angle between patch and goal to calc-goal-angle   set left-angle  towardsxy (goal-pos - 0.5)                             (min-pycor + 0.5)   set right-angle towardsxy (goal-pos + goal-size - 0.5)                             (min-pycor + 0.5)   set goal-angle (right-angle - left-angle) mod 360 end   ; Copyright 1997 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":317,"top":10,"right":691,"bottom":505,"dimensions":{"minPxcor":0,"maxPxcor":60,"minPycor":0,"maxPycor":80,"patchSize":6,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":83,"top":192,"right":148,"bottom":225,"display":"setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"59","compiledStep":"1","variable":"kick-line","left":18,"top":84,"right":155,"bottom":117,"display":"kick-line","min":"1","max":"59","default":20,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"22","compiledStep":"1","variable":"goal-size","left":82,"top":121,"right":219,"bottom":154,"display":"goal-size","min":"1","max":"22","default":11,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"49","compiledStep":"1","variable":"goal-pos","left":159,"top":84,"right":296,"bottom":117,"display":"goal-pos","min":"1","max":"49","default":40,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":160,"top":192,"right":226,"bottom":225,"display":"go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"best-dist\")","source":"best-dist","left":132,"top":258,"right":301,"bottom":303,"display":"best distance (experimental)","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"analytic\")","source":"analytic","left":132,"top":308,"right":301,"bottom":353,"display":"best distance (analytic)","precision":2,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"variable":"show-level-curves?","left":63,"top":47,"right":239,"bottom":80,"display":"show-level-curves?","on":false,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"kicks\")","source":"kicks","left":15,"top":258,"right":116,"bottom":303,"precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledSource":"world.observer.getGlobal(\"goals\")","source":"goals","left":15,"top":308,"right":116,"bottom":353,"precision":0,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").porters())(["kick-line", "goal-size", "goal-pos", "show-level-curves?", "current-max", "col", "ang", "best-dist", "analytic", "try-line", "histogram-area", "kicks", "goals"], ["kick-line", "goal-size", "goal-pos", "show-level-curves?"], ["score", "left-angle", "right-angle", "goal-angle", "slope"], 0, 60, 0, 80, 6, false, false, turtleShapes, linkShapes, function(){});
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
      world.clearAll();
      procedures["SETUP-FIELD"]();
      procedures["SETUP-BALLS"]();
      world.observer.setGlobal("current-max", 0);
      world.observer.setGlobal("best-dist", -1);
      world.observer.setGlobal("kicks", 0);
      Errors.askNobodyCheck(world.observer.getGlobal("try-line")).ask(function() { SelfManager.self().setPatchVariable("score", 0); }, true);
      procedures["FIND-ANALYTIC-SOLUTION"]();
      if (world.observer.getGlobal("show-level-curves?")) {
        procedures["DRAW-LEVEL-CURVES"]();
      }
      world.ticker.reset();
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
      Errors.askNobodyCheck(world.patches()).ask(function() {
        if (SelfManager.self().getNeighbors()._optimalCheckCount(8, (a, b) => a !== b)) {
          SelfManager.self().setPatchVariable("pcolor", 15);
        }
        if (((Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor) && Prims.gte(SelfManager.self().getPatchVariable("pxcor"), world.observer.getGlobal("goal-pos"))) && Prims.lt(SelfManager.self().getPatchVariable("pxcor"), (world.observer.getGlobal("goal-pos") + world.observer.getGlobal("goal-size"))))) {
          SelfManager.self().setPatchVariable("pcolor", 55);
        }
      }, true);
      world.observer.setGlobal("try-line", world.patches().agentFilter(function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("pxcor"), world.observer.getGlobal("kick-line")) && Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 0));
      }));
      Errors.askNobodyCheck(world.observer.getGlobal("try-line")).ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
      world.observer.setGlobal("histogram-area", world.patches().agentFilter(function() {
        return (Prims.lt(SelfManager.self().getPatchVariable("pxcor"), world.observer.getGlobal("kick-line")) && Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 0));
      }));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupField"] = temp;
  procs["SETUP-FIELD"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      BreedManager.setDefaultShape(world.turtles().getSpecialName(), "circle")
      Errors.askNobodyCheck(world.observer.getGlobal("try-line")).ask(function() {
        SelfManager.self().sprout(1, "TURTLES").ask(function() {
          SelfManager.self().setVariable("color", 25);
          SelfManager.self().setVariable("start-patch", SelfManager.self().getPatchHere());
          SelfManager.self().setVariable("heading", (PrimChecks.math.randomFloat(90) + 90));
        }, true);
      }, true);
      procedures["PLOT-SCORES"]();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupBalls"] = temp;
  procs["SETUP-BALLS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      while (!world.turtles().isEmpty()) {
        Errors.askNobodyCheck(world.turtles()).ask(function() { procedures["MOVE"](); }, true);
        notImplemented('display', undefined)();
      }
      world.observer.setGlobal("kicks", (world.observer.getGlobal("kicks") + world.observer.getGlobal("try-line").size()));
      world.observer.setGlobal("goals", PrimChecks.list.sum(world.observer.getGlobal("try-line").projectionBy(function() { return SelfManager.self().getPatchVariable("score"); })));
      procedures["SETUP-BALLS"]();
      world.ticker.tick();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["go"] = temp;
  procs["GO"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if ((Prims.gte(SelfManager.self().getPatchVariable("pxcor"), (world.topology.maxPxcor - 1)) || Prims.gte(SelfManager.self().getPatchVariable("pycor"), (world.topology.minPycor + 1)))) {
        procedures["CHECK-PATCH"](procedures["NEXT-PATCH"]());
        procedures["CHECK-PATCH"](SelfManager.self().patchAhead(1));
      }
      SelfManager.self()._optimalFdOne();
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["move"] = temp;
  procs["MOVE"] = temp;
  temp = (function(thePatch) {
    try {
      var reporterContext = false;
      var letVars = { };
      if (Prims.equality(thePatch.projectionBy(function() { return SelfManager.self().getPatchVariable("pcolor"); }), 15)) {
        SelfManager.self().die();
      }
      if (Prims.equality(thePatch.projectionBy(function() { return SelfManager.self().getPatchVariable("pcolor"); }), 55)) {
        Errors.askNobodyCheck(SelfManager.self().getVariable("start-patch")).ask(function() { SelfManager.self().setPatchVariable("score", (SelfManager.self().getPatchVariable("score") + 1)); }, true);
        SelfManager.self().die();
      }
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["checkPatch"] = temp;
  procs["CHECK-PATCH"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      if (Prims.lt(SelfManager.self().getVariable("heading"), SelfManager.self().towardsXY((SelfManager.self().getPatchVariable("pxcor") + 0.5), (SelfManager.self().getPatchVariable("pycor") + 0.5)))) {
        Errors.reportInContextCheck(reporterContext);
        return SelfManager.self()._optimalPatchNorth();
      }
      if (Prims.lt(SelfManager.self().getVariable("heading"), SelfManager.self().towardsXY((SelfManager.self().getPatchVariable("pxcor") + 0.5), (SelfManager.self().getPatchVariable("pycor") - 0.5)))) {
        Errors.reportInContextCheck(reporterContext);
        return SelfManager.self()._optimalPatchEast();
      }
      if (Prims.lt(SelfManager.self().getVariable("heading"), SelfManager.self().towardsXY((SelfManager.self().getPatchVariable("pxcor") - 0.5), (SelfManager.self().getPatchVariable("pycor") - 0.5)))) {
        Errors.reportInContextCheck(reporterContext);
        return SelfManager.self()._optimalPatchSouth();
      }
      if (Prims.lt(SelfManager.self().getVariable("heading"), SelfManager.self().towardsXY((SelfManager.self().getPatchVariable("pxcor") - 0.5), (SelfManager.self().getPatchVariable("pycor") + 0.5)))) {
        Errors.reportInContextCheck(reporterContext);
        return SelfManager.self()._optimalPatchWest();
      }
      Errors.reportInContextCheck(reporterContext);
      return SelfManager.self()._optimalPatchNorth();
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["nextPatch"] = temp;
  procs["NEXT-PATCH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      world.observer.setGlobal("current-max", PrimChecks.list.max(world.observer.getGlobal("try-line").projectionBy(function() { return SelfManager.self().getPatchVariable("score"); })));
      if (Prims.equality(world.observer.getGlobal("current-max"), 0)) {
        Errors.askNobodyCheck(world.observer.getGlobal("histogram-area")).ask(function() { SelfManager.self().setPatchVariable("pcolor", 0); }, true);
        throw new Exception.StopInterrupt;
      }
      Errors.askNobodyCheck(world.observer.getGlobal("try-line")).ask(function() {
        if (Prims.equality(SelfManager.self().getPatchVariable("score"), world.observer.getGlobal("current-max"))) {
          world.observer.setGlobal("best-dist", SelfManager.self().getPatchVariable("pycor"));
          Errors.askNobodyCheck(SelfManager.self().patchAt(2, 0)).ask(function() { SelfManager.self().setPatchVariable("plabel", SelfManager.self().getPatchVariable("pycor")); }, true);
        }
        else {
          if (!Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 125)) {
            Errors.askNobodyCheck(SelfManager.self().patchAt(2, 0)).ask(function() { SelfManager.self().setPatchVariable("plabel", ""); }, true);
          }
        }
      }, true);
      Errors.askNobodyCheck(world.observer.getGlobal("histogram-area")).ask(function() {
        if (Prims.gt(SelfManager.self().getPatchVariable("pxcor"), (world.observer.getGlobal("kick-line") - PrimChecks.math.div((SelfManager.self().patchAt((world.observer.getGlobal("kick-line") - SelfManager.self().getPatchVariable("pxcor")), 0).projectionBy(function() { return SelfManager.self().getPatchVariable("score"); }) * (world.observer.getGlobal("kick-line") - world.topology.minPxcor)), world.observer.getGlobal("current-max"))))) {
          if (Prims.equality(SelfManager.self().patchAt((world.observer.getGlobal("kick-line") - SelfManager.self().getPatchVariable("pxcor")), 0).projectionBy(function() { return SelfManager.self().getPatchVariable("score"); }), world.observer.getGlobal("current-max"))) {
            SelfManager.self().setPatchVariable("pcolor", 45);
          }
          else {
            SelfManager.self().setPatchVariable("pcolor", 105);
          }
        }
        else {
          SelfManager.self().setPatchVariable("pcolor", 0);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["plotScores"] = temp;
  procs["PLOT-SCORES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.patches().agentFilter(function() { return Prims.gt(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor); })).ask(function() { procedures["CALC-GOAL-ANGLE"](); }, true);
      let winningPatch = world.observer.getGlobal("try-line").minOneOf(function() { return SelfManager.self().getPatchVariable("goal-angle"); }); letVars['winningPatch'] = winningPatch;
      Errors.askNobodyCheck(winningPatch).ask(function() {
        SelfManager.self().setPatchVariable("pcolor", 125);
        Errors.askNobodyCheck(SelfManager.self().patchAt(2, 0)).ask(function() { SelfManager.self().setPatchVariable("plabel", SelfManager.self().getPatchVariable("pycor")); }, true);
      }, true);
      world.observer.setGlobal("analytic", winningPatch.projectionBy(function() { return SelfManager.self().getPatchVariable("pycor"); }));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["findAnalyticSolution"] = temp;
  procs["FIND-ANALYTIC-SOLUTION"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.patches().agentFilter(function() {
        return (Prims.gt(SelfManager.self().getPatchVariable("pxcor"), world.observer.getGlobal("kick-line")) && Prims.lt(SelfManager.self().getPatchVariable("pcolor"), 10));
      })).ask(function() {
        if (Prims.gt(SelfManager.self().getPatchVariable("goal-angle"), 270)) {
          SelfManager.self().setPatchVariable("pcolor", ((360 - PrimChecks.math.mod(SelfManager.self().getPatchVariable("goal-angle"), 10)) * 0.8));
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["drawLevelCurves"] = temp;
  procs["DRAW-LEVEL-CURVES"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      SelfManager.self().setPatchVariable("left-angle", SelfManager.self().towardsXY((world.observer.getGlobal("goal-pos") - 0.5), (world.topology.minPycor + 0.5)));
      SelfManager.self().setPatchVariable("right-angle", SelfManager.self().towardsXY(((world.observer.getGlobal("goal-pos") + world.observer.getGlobal("goal-size")) - 0.5), (world.topology.minPycor + 0.5)));
      SelfManager.self().setPatchVariable("goal-angle", PrimChecks.math.mod((SelfManager.self().getPatchVariable("right-angle") - SelfManager.self().getPatchVariable("left-angle")), 360));
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["calcGoalAngle"] = temp;
  procs["CALC-GOAL-ANGLE"] = temp;
  return procs;
})();
world.observer.setGlobal("kick-line", 20);
world.observer.setGlobal("goal-size", 11);
world.observer.setGlobal("goal-pos", 40);
world.observer.setGlobal("show-level-curves?", false);