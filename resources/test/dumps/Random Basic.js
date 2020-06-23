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
var turtleShapes = {"default":{"name":"default","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,40,150,260],"ycors":[5,250,205,250],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"airplane":{"name":"airplane","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,135,120,120,15,15,120,135,105,120,150,180,210,165,180,285,285,180,180,165],"ycors":[0,15,60,105,165,195,180,240,270,285,270,285,270,240,180,195,165,105,60,15],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"arrow":{"name":"arrow","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,0,105,105,195,195,300],"ycors":[0,150,150,293,293,150,150],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"box":{"name":"box","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,285,285,150],"ycors":[285,225,75,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,15,150,285],"ycors":[135,75,15,75],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[15,15,150,150],"ycors":[75,225,285,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":285,"x2":150,"y2":135,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":15,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":135,"x2":285,"y2":75,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"bug":{"name":"bug","editableColorIndex":0,"rotate":true,"elements":[{"x":96,"y":182,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":127,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":110,"y":75,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":150,"y1":100,"x2":80,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":150,"y1":100,"x2":220,"y2":30,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"butterfly":{"name":"butterfly","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[150,209,225,225,195,165,150],"ycors":[165,199,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,89,75,75,105,135,150],"ycors":[165,198,225,255,270,255,240],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[139,100,55,25,10,10,25,40,85,139],"ycors":[148,105,90,90,105,135,180,195,194,163],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[162,200,245,275,290,290,275,260,215,162],"ycors":[150,105,90,90,105,135,180,195,195,165],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[150,135,120,135,150,165,180,165],"ycors":[255,225,150,120,105,120,150,225],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":135,"y":90,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":105,"x2":195,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false},{"x1":150,"y1":105,"x2":105,"y2":60,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"car":{"name":"car","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[300,279,261,240,226,213,203,185,159,135,75,0,0,0,300,300],"ycors":[180,164,144,135,132,106,84,63,50,50,60,150,165,225,225,180],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":180,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":30,"y":180,"diam":90,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[162,132,134,209,194,189,180],"ycors":[80,78,135,135,105,96,89],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":47,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":195,"y":195,"diam":58,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle":{"name":"circle","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"circle 2":{"name":"circle 2","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"cow":{"name":"cow","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[200,197,179,177,166,140,93,78,72,49,48,37,25,25,45,103,179,198,252,272,293,285,255,242,224],"ycors":[193,249,249,196,187,189,191,179,211,209,181,149,120,89,72,84,75,76,64,81,103,121,121,118,167],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[73,86,62,48],"ycors":[210,251,249,208],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[25,16,9,23,25,39],"ycors":[114,195,204,213,200,123],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"cylinder":{"name":"cylinder","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"dot":{"name":"dot","editableColorIndex":0,"rotate":false,"elements":[{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"face happy":{"name":"face happy","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[255,239,213,191,179,203,218,225,218,203,181,194,217,240],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face neutral":{"name":"face neutral","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":7,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":60,"ymin":195,"xmax":240,"ymax":225,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"face sad":{"name":"face sad","editableColorIndex":0,"rotate":false,"elements":[{"x":8,"y":8,"diam":285,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":60,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":180,"y":75,"diam":60,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[150,90,62,47,67,90,109,150,192,210,227,251,236,212],"ycors":[168,184,210,232,244,220,205,198,205,220,242,229,206,183],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"fish":{"name":"fish","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[44,21,15,0,15,0,13,20,45],"ycors":[131,87,86,120,150,180,214,212,166],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[135,119,95,76,46,60],"ycors":[195,235,218,210,204,165],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[75,83,71,86,166,135],"ycors":[45,77,103,114,78,60],"type":"polygon","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[30,151,226,280,292,292,287,270,195,151,30],"ycors":[136,77,81,119,146,160,170,195,210,212,166],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":215,"y":106,"diam":30,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"flag":{"name":"flag","editableColorIndex":0,"rotate":false,"elements":[{"xmin":60,"ymin":15,"xmax":75,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[90,270,90],"ycors":[150,90,30],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":75,"y1":135,"x2":90,"y2":135,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":75,"y1":45,"x2":90,"y2":45,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"flower":{"name":"flower","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[135,165,180,180,150,165,195,195,165],"ycors":[120,165,210,240,300,300,240,195,135],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"x":85,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":147,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":192,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":85,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":40,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":177,"y":132,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":70,"y":85,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":130,"y":25,"diam":38,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":96,"y":51,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":113,"y":68,"diam":74,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[189,219,249,279,234],"ycors":[233,188,173,188,218],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[180,150,105,75,135],"ycors":[255,210,210,240,240],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false}]},"frame":{"name":"frame","editableColorIndex":0,"rotate":false,"elements":[{"xmin":-1,"ymin":1,"xmax":15,"ymax":301,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":1,"ymin":-5,"xmax":303,"ymax":16,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":285,"ymin":0,"xmax":315,"ymax":305,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":0,"ymin":285,"xmax":297,"ymax":299,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":13,"ymin":10,"xmax":30,"ymax":292,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":9,"ymin":31,"xmax":11,"ymax":32,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":16,"ymin":8,"xmax":293,"ymax":30,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":270,"ymin":23,"xmax":299,"ymax":292,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":14,"ymin":273,"xmax":15,"ymax":274,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":15,"ymin":272,"xmax":16,"ymax":272,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":15,"ymin":271,"xmax":290,"ymax":289,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"house":{"name":"house","editableColorIndex":0,"rotate":false,"elements":[{"xmin":45,"ymin":120,"xmax":255,"ymax":285,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":210,"xmax":180,"ymax":285,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xcors":[15,150,285],"ycors":[120,15,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":30,"y1":120,"x2":270,"y2":120,"type":"line","color":"rgba(0, 0, 0, 1)","filled":false,"marked":false}]},"leaf":{"name":"leaf","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,135,120,60,30,60,60,15,30,15,40,45,60,90,105,120,105,120,135,150,165,180,195,180,195,210,240,255,263,285,270,285,240,240,270,240,180,165],"ycors":[210,195,210,210,195,180,165,135,120,105,104,90,90,105,120,120,60,60,30,15,30,60,60,120,120,105,90,90,104,105,120,135,165,180,195,210,210,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,135,120,105,105,135,165,165],"ycors":[195,240,255,255,285,285,240,195],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"line":{"name":"line","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":300,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"line half":{"name":"line half","editableColorIndex":0,"rotate":true,"elements":[{"x1":150,"y1":0,"x2":150,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"pentagon":{"name":"pentagon","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,60,240,285],"ycors":[15,120,285,285,120],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"person":{"name":"person","editableColorIndex":0,"rotate":false,"elements":[{"x":110,"y":5,"diam":80,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,120,90,105,135,150,165,195,210,180,195],"ycors":[90,195,285,300,300,225,300,300,285,195,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":127,"ymin":79,"xmax":172,"ymax":94,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[195,240,225,165],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[105,60,75,135],"ycors":[90,150,180,105],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"plant":{"name":"plant","editableColorIndex":0,"rotate":false,"elements":[{"xmin":135,"ymin":90,"xmax":165,"ymax":300,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,210,255,225,165],"ycors":[255,210,195,255,285],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[180,135,120,180,210],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[180,210,180,120,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,90,45,75,135],"ycors":[105,60,45,105,135],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[165,165,225,255,210],"ycors":[105,135,105,45,60],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[135,120,150,180,165],"ycors":[90,45,15,45,90],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square":{"name":"square","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"square 2":{"name":"square 2","editableColorIndex":0,"rotate":false,"elements":[{"xmin":30,"ymin":30,"xmax":270,"ymax":270,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":60,"ymin":60,"xmax":240,"ymax":240,"type":"rectangle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"star":{"name":"star","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[151,185,298,207,242,151,59,94,3,116],"ycors":[1,108,108,175,282,216,282,175,108,108],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"target":{"name":"target","editableColorIndex":0,"rotate":false,"elements":[{"x":0,"y":0,"diam":300,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":60,"y":60,"diam":180,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":90,"y":90,"diam":120,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"tree":{"name":"tree","editableColorIndex":0,"rotate":false,"elements":[{"x":118,"y":3,"diam":94,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":120,"ymin":195,"xmax":180,"ymax":300,"type":"rectangle","color":"rgba(157, 110, 72, 1)","filled":true,"marked":false},{"x":65,"y":21,"diam":108,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":116,"y":41,"diam":127,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":45,"y":90,"diam":120,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":104,"y":74,"diam":152,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle":{"name":"triangle","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"triangle 2":{"name":"triangle 2","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[150,15,285],"ycors":[30,255,255],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[151,225,75],"ycors":[99,223,224],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false}]},"truck":{"name":"truck","editableColorIndex":0,"rotate":false,"elements":[{"xmin":4,"ymin":45,"xmax":195,"ymax":187,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[296,296,259,244,208,207],"ycors":[193,150,134,104,104,194],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xmin":195,"ymin":60,"xmax":195,"ymax":105,"type":"rectangle","color":"rgba(255, 255, 255, 1)","filled":true,"marked":false},{"xcors":[238,252,219,218],"ycors":[112,141,141,112],"type":"polygon","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"xmin":181,"ymin":185,"xmax":214,"ymax":194,"type":"rectangle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x":24,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":144,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":234,"y":174,"diam":42,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"turtle":{"name":"turtle","editableColorIndex":0,"rotate":true,"elements":[{"xcors":[215,240,246,228,215,193],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[195,225,245,260,269,261,240,225,210],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[105,75,55,40,31,39,60,75,90],"ycors":[90,75,75,89,108,124,105,105,105],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[132,134,107,108,150,192,192,169,172],"ycors":[85,64,51,17,2,18,52,65,87],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[85,60,54,72,85,107],"ycors":[204,233,254,266,252,210],"type":"polygon","color":"rgba(89, 176, 60, 1)","filled":true,"marked":false},{"xcors":[119,179,209,224,220,175,128,81,74,88],"ycors":[75,75,101,135,225,261,261,224,135,99],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]},"wheel":{"name":"wheel","editableColorIndex":0,"rotate":false,"elements":[{"x":3,"y":3,"diam":294,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x":30,"y":30,"diam":240,"type":"circle","color":"rgba(0, 0, 0, 1)","filled":true,"marked":false},{"x1":150,"y1":285,"x2":150,"y2":15,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":15,"y1":150,"x2":285,"y2":150,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x":120,"y":120,"diam":60,"type":"circle","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"x1":216,"y1":40,"x2":79,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":84,"x2":269,"y2":221,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":40,"y1":216,"x2":269,"y2":79,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true},{"x1":84,"y1":40,"x2":221,"y2":269,"type":"line","color":"rgba(141, 141, 141, 1)","filled":false,"marked":true}]},"x":{"name":"x","editableColorIndex":0,"rotate":false,"elements":[{"xcors":[270,225,30,75],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true},{"xcors":[30,75,270,225],"ycors":[75,30,225,270],"type":"polygon","color":"rgba(141, 141, 141, 1)","filled":true,"marked":true}]}};
var modelConfig =
  (
    (typeof global !== "undefined" && global !== null) ? global :
    (typeof window !== "undefined" && window !== null) ? window :
    {}
  ).modelConfig || {};
var modelPlotOps = (typeof modelConfig.plotOps !== "undefined" && modelConfig.plotOps !== null) ? modelConfig.plotOps : {};
modelConfig.plots = [];
var workspace = tortoise_require('engine/workspace')(modelConfig)([{ name: "COLUMN-COUNTERS", singular: "column-counter", varNames: ["my-column", "my-column-patches"] }, { name: "FRAMES", singular: "frame", varNames: [] }, { name: "MESSENGERS", singular: "messenger", varNames: [] }])([], [])('globals [   time-to-stop?   ;; boolean that discontinues run when columns reach to top   the-messenger       ;; holds identity of the single turtle of breed \'messengers\'                   ;; (see EXTENDING THE MODEL)   max-y-histogram ;; how high the columns can rise (or how far up the yellow goes) ]  breed [ column-counters column-counter ] ;; they keep track of their respective histogram columns breed [ frames frame ]    ;; square frames that indicate events in histogram columns breed [ messengers messenger  ]  ;; carry the random value to its column                   ;; (currently just one single messenger implemented)   column-counters-own [   ;; if you choose a sample-space 7 then you get 7 column-counters   ;; and their respective my-columns will be 1 thru 7   my-column   ;; each column-counter holds all patches that are in its column as an agentset   my-column-patches ]  to setup   clear-all   ;; computes the height the user has requested so as to get the value that makes sense   ;; in this model because the histogram grows from the negative-y values and not from 0   set max-y-histogram (min-pycor + height)   create-histogram-width   setup-column-counters   set time-to-stop? false   reset-ticks end  to create-histogram-width   ask patches   [     ;; deals with both even and odd sample-spaces     ;; this is one way of centering the histogram.     ;; that means that the \'50\' of the red-green slider     ;; will always be aligned with the middle of the histogram     ifelse (pxcor >= (- sample-space) / 2) and (pxcor < sample-space / 2)             and (pycor < max-y-histogram) ;; this shapes the top of the yellow zone     [ set pcolor yellow ]     [ set pcolor brown ]   ] end      ;; column-counters are turtles who form \"place-holders\" so that     ;; the messenger will \"know\" where to take its value.     ;; they are like the values on the x-axis of your sample space. to setup-column-counters   ask patches with [(pycor = min-pycor) ;; bottom of the view                        and pcolor = yellow]      ;; and in the histogram band width   [     sprout-column-counters 1     [       hide-turtle  ;; it is nice to see them but probably visually redundant       set heading 0       ;; this assigns a column name to column-counters that       ;; corresponds with the parameter setting of sample-space       set my-column floor (pxcor + sample-space / 2 + 1)       set my-column-patches patches with [ pxcor = [pxcor] of myself ]     ]   ]  end  to go ;; forever button   if time-to-stop? [ stop ]   select-random-value   send-messenger-to-its-column   ifelse colors?     [ paint ]     [ ask patches with [pcolor != brown] [ set pcolor yellow ]]   tick end      ;; \'messenger\' is a turtle who carries the random value     ;; on its back as a label to select-random-value   ask patch 0 (max-y-histogram + 4)   [     sprout-messengers 1     [       set shape \"default\"       set color black       set heading 180       set size 12       set label 1 + random sample-space       ;; currently there is just one messenger, so we assign it to a \'messenger\'       ;; variable. this will save time when the model run. if the user chooses       ;; to add more messengers then this shortcut may have to be done away with       set the-messenger self     ]   ] end      ;; messenger is the dart-shaped large turtle that carries the random value     ;; on its back. it takes this value directly to the appropriate column to send-messenger-to-its-column                 ;; \'it\' holds the column-counter who is master of the                 ;; column towards which the messenger orients and advances                 ;; to dispatch its event   let it one-of column-counters with [ my-column = [label] of the-messenger ]    ask the-messenger   [     face it     ;; keep advancing until you\'re all but covering your destination     while [ distance it > 3 ]     [       fd 1 ;; to the patch above you to prepare for next event       display     ]     die   ]   ask it   [ create-frame     fd 1     ;; if the histogram has become too high, we just stop.     ;; this could be extended so as to have the whole population     ;; of events collapse down one patch, as in Galton Box     if ycor = max-y-histogram [ set time-to-stop? true ]   ]  end  ;; make the square frames that look like accumulating cubes to create-frame ;; turtle procedure   ask patch-here   [     sprout-frames 1     [       set shape \"frame\"       set color black     ]   ] end      ;; patches are red if they are as far to the right within the sample-space     ;; as indexed by the red-green slider; otherwise, the are green     ;; Note that currently there is no rounding -- just a cut-off contour. to paint   ask column-counters   [     ifelse my-column <= (red-green * sample-space / 100)     [ ask my-column-patches with [ pycor < [pycor] of myself ] [ set pcolor red ] ]     [ ask my-column-patches with [ pycor < [pycor] of myself ] [ set pcolor green ] ]   ] end  ;; reports the percentage of red patches out of all patches that have frames ;; so we know what percent of events are to the left of the cut off line to-report %-red   report precision (100 * count patches with [pcolor = red] / count frames) 2 end  to-report %-full   report precision ( 100 * (count frames ) / ( height * sample-space ) ) 2  end  ;; biggest-gap is the greatest difference in height between all columns to-report biggest-gap   let max-column max [count my-column-patches with [pycor < [pycor] of myself] ] of column-counters    let min-column min [count my-column-patches with [pycor < [pycor] of myself] ] of column-counters    report max-column - min-column end   ; Copyright 2004 Uri Wilensky. ; See Info tab for full copyright and license.')([{"left":178,"top":10,"right":893,"bottom":446,"dimensions":{"minPxcor":-50,"maxPxcor":50,"minPycor":-30,"maxPycor":30,"patchSize":7,"wrappingAllowedInX":false,"wrappingAllowedInY":false},"fontSize":10,"updateMode":"TickBased","showTickCounter":true,"tickCounterLabel":"ticks","frameRate":30,"type":"view","compilation":{"success":true,"messages":[]}}, {"compiledMin":"0","compiledMax":"100","compiledStep":"1","variable":"red-green","left":173,"top":469,"right":890,"bottom":502,"display":"red-green","min":"0","max":"100","default":50,"step":"1","units":"%","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_38 = procedures[\"SETUP\"]();   if (_maybestop_33_38 instanceof Exception.StopInterrupt) { return _maybestop_33_38; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"setup","left":12,"top":109,"right":75,"bottom":142,"display":"Setup","forever":false,"buttonKind":"Observer","disableUntilTicksStart":false,"type":"button","compilation":{"success":true,"messages":[]}}, {"compiledSource":"try {   var reporterContext = false;   var letVars = { };   let _maybestop_33_35 = procedures[\"GO\"]();   if (_maybestop_33_35 instanceof Exception.StopInterrupt) { return _maybestop_33_35; } } catch (e) {   return Errors.stopInCommandCheck(e) }","source":"go","left":78,"top":109,"right":141,"bottom":142,"display":"Go","forever":true,"buttonKind":"Observer","disableUntilTicksStart":true,"type":"button","compilation":{"success":true,"messages":[]}}, {"variable":"colors?","left":33,"top":266,"right":123,"bottom":299,"display":"colors?","on":true,"type":"switch","compilation":{"success":true,"messages":[]}}, {"compiledSource":"procedures[\"%-RED\"]()","source":"%-red","left":32,"top":212,"right":124,"bottom":257,"display":"%-red","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"100","compiledStep":"1","variable":"sample-space","left":1,"top":36,"right":173,"bottom":69,"display":"sample-space","min":"1","max":"100","default":100,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"procedures[\"BIGGEST-GAP\"]()","source":"biggest-gap","left":32,"top":150,"right":124,"bottom":195,"display":"biggest gap","precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}, {"compiledMin":"1","compiledMax":"50","compiledStep":"1","variable":"height","left":1,"top":70,"right":173,"bottom":103,"display":"height","min":"1","max":"50","default":30,"step":"1","direction":"horizontal","type":"slider","compilation":{"success":true,"messages":[]}}, {"compiledSource":"procedures[\"%-FULL\"]()","source":"%-full","left":47,"top":320,"right":104,"bottom":365,"precision":3,"fontSize":11,"type":"monitor","compilation":{"success":true,"messages":[]}}])(tortoise_require("extensions/all").dumpers())(["red-green", "colors?", "sample-space", "height", "time-to-stop?", "the-messenger", "max-y-histogram"], ["red-green", "colors?", "sample-space", "height"], [], -50, 50, -30, 30, 7, false, false, turtleShapes, linkShapes, function(){});
var Extensions = tortoise_require('extensions/all').initialize(workspace);
var BreedManager = workspace.breedManager;
var ImportExportPrims = workspace.importExportPrims;
var InspectionPrims = workspace.inspectionPrims;
var LayoutManager = workspace.layoutManager;
var LinkPrims = workspace.linkPrims;
var ListPrims = workspace.listPrims;
var MousePrims = workspace.mousePrims;
var OutputPrims = workspace.outputPrims;
var Prims = workspace.prims;
var PrintPrims = workspace.printPrims;
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
      world.observer.setGlobal("max-y-histogram", (world.topology.minPycor + world.observer.getGlobal("height")));
      procedures["CREATE-HISTOGRAM-WIDTH"]();
      procedures["SETUP-COLUMN-COUNTERS"]();
      world.observer.setGlobal("time-to-stop?", false);
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
        if (((Prims.gte(SelfManager.self().getPatchVariable("pxcor"), Prims.div( -(world.observer.getGlobal("sample-space")), 2)) && Prims.lt(SelfManager.self().getPatchVariable("pxcor"), Prims.div(world.observer.getGlobal("sample-space"), 2))) && Prims.lt(SelfManager.self().getPatchVariable("pycor"), world.observer.getGlobal("max-y-histogram")))) {
          SelfManager.self().setPatchVariable("pcolor", 45);
        }
        else {
          SelfManager.self().setPatchVariable("pcolor", 35);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["createHistogramWidth"] = temp;
  procs["CREATE-HISTOGRAM-WIDTH"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.patches().agentFilter(function() {
        return (Prims.equality(SelfManager.self().getPatchVariable("pycor"), world.topology.minPycor) && Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 45));
      })).ask(function() {
        SelfManager.self().sprout(1, "COLUMN-COUNTERS").ask(function() {
          SelfManager.self().hideTurtle(true);;
          SelfManager.self().setVariable("heading", 0);
          SelfManager.self().setVariable("my-column", NLMath.floor(((SelfManager.self().getPatchVariable("pxcor") + Prims.div(world.observer.getGlobal("sample-space"), 2)) + 1)));
          SelfManager.self().setVariable("my-column-patches", world.patches().agentFilter(function() {
            return Prims.equality(SelfManager.self().getPatchVariable("pxcor"), SelfManager.myself().projectionBy(function() { return SelfManager.self().getPatchVariable("pxcor"); }));
          }));
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["setupColumnCounters"] = temp;
  procs["SETUP-COLUMN-COUNTERS"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      if (world.observer.getGlobal("time-to-stop?")) {
        throw new Exception.StopInterrupt;
      }
      procedures["SELECT-RANDOM-VALUE"]();
      procedures["SEND-MESSENGER-TO-ITS-COLUMN"]();
      if (world.observer.getGlobal("colors?")) {
        procedures["PAINT"]();
      }
      else {
        Errors.askNobodyCheck(world.patches().agentFilter(function() { return !Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 35); })).ask(function() { SelfManager.self().setPatchVariable("pcolor", 45); }, true);
      }
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
      Errors.askNobodyCheck(world.getPatchAt(0, (world.observer.getGlobal("max-y-histogram") + 4))).ask(function() {
        SelfManager.self().sprout(1, "MESSENGERS").ask(function() {
          SelfManager.self().setVariable("shape", "default");
          SelfManager.self().setVariable("color", 0);
          SelfManager.self().setVariable("heading", 180);
          SelfManager.self().setVariable("size", 12);
          SelfManager.self().setVariable("label", (1 + Prims.random(world.observer.getGlobal("sample-space"))));
          world.observer.setGlobal("the-messenger", SelfManager.self());
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["selectRandomValue"] = temp;
  procs["SELECT-RANDOM-VALUE"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      let it = world.turtleManager.turtlesOfBreed("COLUMN-COUNTERS")._optimalOneOfWith(function() {
        return Prims.equality(SelfManager.self().getVariable("my-column"), world.observer.getGlobal("the-messenger").projectionBy(function() { return SelfManager.self().getVariable("label"); }));
      }); letVars['it'] = it;
      Errors.askNobodyCheck(world.observer.getGlobal("the-messenger")).ask(function() {
        SelfManager.self().face(it);
        while (Prims.gt(SelfManager.self().distance(it), 3)) {
          SelfManager.self()._optimalFdOne();
          notImplemented('display', undefined)();
        }
        SelfManager.self().die();
      }, true);
      Errors.askNobodyCheck(it).ask(function() {
        procedures["CREATE-FRAME"]();
        SelfManager.self()._optimalFdOne();
        if (Prims.equality(SelfManager.self().getVariable("ycor"), world.observer.getGlobal("max-y-histogram"))) {
          world.observer.setGlobal("time-to-stop?", true);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["sendMessengerToItsColumn"] = temp;
  procs["SEND-MESSENGER-TO-ITS-COLUMN"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(SelfManager.self().getPatchHere()).ask(function() {
        SelfManager.self().sprout(1, "FRAMES").ask(function() {
          SelfManager.self().setVariable("shape", "frame");
          SelfManager.self().setVariable("color", 0);
        }, true);
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["createFrame"] = temp;
  procs["CREATE-FRAME"] = temp;
  temp = (function() {
    try {
      var reporterContext = false;
      var letVars = { };
      Errors.askNobodyCheck(world.turtleManager.turtlesOfBreed("COLUMN-COUNTERS")).ask(function() {
        if (Prims.lte(SelfManager.self().getVariable("my-column"), Prims.div((world.observer.getGlobal("red-green") * world.observer.getGlobal("sample-space")), 100))) {
          Errors.askNobodyCheck(SelfManager.self().getVariable("my-column-patches").agentFilter(function() {
            return Prims.lt(SelfManager.self().getPatchVariable("pycor"), SelfManager.myself().projectionBy(function() { return SelfManager.self().getPatchVariable("pycor"); }));
          })).ask(function() { SelfManager.self().setPatchVariable("pcolor", 15); }, true);
        }
        else {
          Errors.askNobodyCheck(SelfManager.self().getVariable("my-column-patches").agentFilter(function() {
            return Prims.lt(SelfManager.self().getPatchVariable("pycor"), SelfManager.myself().projectionBy(function() { return SelfManager.self().getPatchVariable("pycor"); }));
          })).ask(function() { SelfManager.self().setPatchVariable("pcolor", 55); }, true);
        }
      }, true);
    } catch (e) {
      return Errors.stopInCommandCheck(e)
    }
  });
  procs["paint"] = temp;
  procs["PAINT"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return NLMath.precision(Prims.div((100 * world.patches().agentFilter(function() { return Prims.equality(SelfManager.self().getPatchVariable("pcolor"), 15); }).size()), world.turtleManager.turtlesOfBreed("FRAMES").size()), 2);
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["_percent_Red"] = temp;
  procs["%-RED"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      Errors.reportInContextCheck(reporterContext);
      return NLMath.precision(Prims.div((100 * world.turtleManager.turtlesOfBreed("FRAMES").size()), (world.observer.getGlobal("height") * world.observer.getGlobal("sample-space"))), 2);
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["_percent_Full"] = temp;
  procs["%-FULL"] = temp;
  temp = (function() {
    try {
      var reporterContext = true;
      var letVars = { };
      let maxColumn = ListPrims.max(world.turtleManager.turtlesOfBreed("COLUMN-COUNTERS").projectionBy(function() {
        return SelfManager.self().getVariable("my-column-patches").agentFilter(function() {
          return Prims.lt(SelfManager.self().getPatchVariable("pycor"), SelfManager.myself().projectionBy(function() { return SelfManager.self().getPatchVariable("pycor"); }));
        }).size();
      })); letVars['maxColumn'] = maxColumn;
      let minColumn = ListPrims.min(world.turtleManager.turtlesOfBreed("COLUMN-COUNTERS").projectionBy(function() {
        return SelfManager.self().getVariable("my-column-patches").agentFilter(function() {
          return Prims.lt(SelfManager.self().getPatchVariable("pycor"), SelfManager.myself().projectionBy(function() { return SelfManager.self().getPatchVariable("pycor"); }));
        }).size();
      })); letVars['minColumn'] = minColumn;
      Errors.reportInContextCheck(reporterContext);
      return (maxColumn - minColumn);
      Errors.missingReport();
    } catch (e) {
      Errors.stopInReportCheck(e)
    }
  });
  procs["biggestGap"] = temp;
  procs["BIGGEST-GAP"] = temp;
  return procs;
})();
world.observer.setGlobal("red-green", 50);
world.observer.setGlobal("colors?", true);
world.observer.setGlobal("sample-space", 100);
world.observer.setGlobal("height", 30);