/*
 float ang = 0, ang2 = 0, ang3 = 0, ang4 = 0;
 float px = 0, py = 0, pz = 0;
 float flapSpeed = 0.2;

 void setup() {
   size(200, 200, OPENGL);
   frameRate(50);
   noStroke();
 }

 void draw() {
   background(0);
   camera();
   // Flight
   px = sin(radians(ang3)) * 170;
   py = cos(radians(ang3)) * 300;
   pz = sin(radians(ang4)) * 500;
   translate(width/2 + px, height/2 + py, -700+pz);
   rotateX(sin(radians(ang2)) * 120);
   rotateY(sin(radians(ang2)) * 50);
   rotateZ(sin(radians(ang2)) * 65);

   // Body
   fill(153);
   box(20, 100, 20);
   // Left wing
   fill(204);
   pushMatrix();
   rotateY(sin(radians(ang)) * -20);
   rect(-75, -50, 75, 100);
   popMatrix();
   // Right wing
   pushMatrix();
   rotateY(sin(radians(ang)) * 20);
   rect(0, -50, 75, 100);
   popMatrix();
   // Wing flap
   ang += flapSpeed;
   if (ang &gt; 3) {
     flapSpeed *= -1;
   }
   if (ang &lt; -3) {
     flapSpeed *= -1;
   }
   // Increment angles
   ang2 += 0.01;
   ang3 += 2.0;
   ang4 += 0.75;
 }
*/

(function(){
  "use strict";

  var canvas = document.getElementById('glibcanvas');
  var pjs = new Processing(canvas);

  var ang = 0, ang2 = 0, ang3 = 0, ang4 = 0;
  var px = 0, py = 0, pz = 0;
  var flapSpeed = 0.2;

    pjs.setup = function() {
      pjs.size(400, 400, pjs.OPENGL);
      pjs.frameRate(50);
      pjs.noStroke();
     }

     pjs.draw = function() {
       pjs.background(0);
       pjs.camera();

       // Flight
       px = pjs.sin(pjs.radians(ang3)) * 170;
       py = pjs.cos(pjs.radians(ang3)) * 300;
       pz = pjs.sin(pjs.radians(ang4)) * 500;
       pjs.translate(pjs.width/2 + px, pjs.height/2 + py, -700 + pz);
       pjs.rotateX(pjs.sin(pjs.radians(ang2)) * 120);
       pjs.rotateY(pjs.sin(pjs.radians(ang2)) * 50);
       pjs.rotateZ(pjs.sin(pjs.radians(ang2)) * 65);

       // Body
       pjs.fill(153);
       pjs.box(20, 100, 20);

       // Left wing
       pjs.fill(204);
       pjs.pushMatrix();
       pjs.rotateY(pjs.sin(pjs.radians(ang)) * -20);
       pjs.rect(-75, -50, 75, 100);
       pjs.popMatrix();

       // Right wing
       pjs.pushMatrix();
       pjs.rotateY(pjs.sin(pjs.radians(ang)) * 20);
       pjs.rect(0, -50, 75, 100);
       pjs.popMatrix();

       // Wing flap
       ang += flapSpeed;
       if (ang > 3) {
         flapSpeed *= -1;
       }
       if (ang < -3) {
         flapSpeed *= -1;
       }
       // Increment angles
       ang2 += 0.01;
       ang3 += 2.0;
       ang4 += 0.75;
     }

   // kickstart the sketch
   pjs.setup();
})();
