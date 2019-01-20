/*

void setup() {
  size(100, 100, P3D);
}

void draw() {
  background(200);
  stroke(255, 50);
  translate(50, 50, 0);
  rotateX(mouseY * 0.05);
  rotateY(mouseX * 0.05);
  fill(mouseX * 2, 0, 160);
  sphereDetail(mouseX / 4);
  sphere(40);
}

*/

(function(){
  "use strict";

  var canvas = document.getElementById('glibcanvas');
  var pjs = new Processing(canvas);

  var flagStroke = true;

    pjs.setup = function() {
       pjs.size(200, 200, pjs.P3D);
       //pjs.smooth();
       pjs.frameRate(50);
     }

     pjs.draw = function() {
       pjs.background(200);
       if (flagStroke) {
         pjs.stroke(255, 50);
       } else {
         pjs.noStroke();
       }

       pjs.translate(50, 50, 0);
       pjs.rotateX(pjs.mouseY * 0.05);
       pjs.rotateY(pjs.mouseX * 0.05);
       pjs.fill(pjs.mouseX * 2, 0, 160);
       pjs.sphereDetail(pjs.mouseX / 4);
       pjs.sphere(40);
     }

     pjs.keyPressed = function() {
       if(pjs.key == 97) {
          flagStroke = !flagStroke;
       }
     }

   // kickstart the sketch
   pjs.setup();
})();
