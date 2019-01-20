(function(){
  "use strict";

  var canvas = document.getElementById('glibcanvas');
  var pjs = new Processing(canvas);

    pjs.setup = function() {
      pjs.size(400, 400, pjs.OPENGL);
      pjs.noStroke();
      pjs.background(50);
      pjs.lights();
      pjs.translate(pjs.width/2+30, pjs.height/2, 0);
      pjs.rotateX(-pjs.PI/6);
      pjs.rotateY(pjs.PI/3 + 210/pjs.height * pjs.PI);
      pjs.box(45);
      pjs.translate(0, 0, -50);
      pjs.box(30);
      pjs.noLoop();
     }

     pjs.draw = function() {
     }


   // kickstart the sketch
   pjs.setup();
})();
