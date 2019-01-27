/*


void setup()
{
  size( 640, 480, OPENGL );

}

void draw()
{
background( 255 );
lights();
float angleY = radians( frameCount );
pushMatrix();
translate( width * 0.3, height* 0.3 );
rotateY( angleY );
fill( 0, 255, 255 );
box( 100 );
popMatrix();
pushMatrix();
translate( width * 0.5, height* 0.5 );
rotateY( angleY );
fill( 0, 255, 0 );
box( 100, 40, 50 );
popMatrix();
pushMatrix();
translate( width * 0.7, height * 0.3 );
rotateY( angleY );
fill( 255, 0, 0 );
sphereDetail( 30 );
sphere( 75 );
popMatrix();
pushMatrix();
translate( width * 0.3, height * 0.7 );
rotateY( angleY );
fill( 255, 255, 0 );
sphereDetail( 6 );
sphere( 75 );
popMatrix();
pushMatrix();
translate( width * 0.7, height * 0.7 );
rotateY( angleY );
fill( 255, 0, 255 );
sphereDetail( 4, 20 );
sphere( 75 );
popMatrix();

}

*/

var sketch = function( dom_canvas ) {
  "use strict";

  var canvas = document.getElementById(dom_canvas);
  var pjs = new Processing(canvas);

  var flagStroke = true;

    pjs.setup = function() {
       pjs.size(640, 480, pjs.OPENGL);
       //pjs.smooth();
       pjs.frameRate(50);
     }

     pjs.draw = function() {
       pjs.background( 255 );
       if (!flagStroke) {
          pjs.noStroke();
       } else {
         pjs.stroke();
       }
       pjs.lights();
       let angleY = pjs.radians( pjs.frameCount );
       pjs.pushMatrix();
       pjs.translate( pjs.width * 0.3, pjs.height* 0.3 );
       pjs.rotateY( angleY );
       pjs.fill( 0, 255, 255 );
       pjs.box( 100 );
       pjs.popMatrix();
       pjs.pushMatrix();
       pjs.translate( pjs.width * 0.5, pjs.height* 0.5 );
       pjs.rotateY( angleY );
       pjs.fill( 0, 255, 0 );
       pjs.box( 100, 40, 50 );
       pjs.popMatrix();
       pjs.pushMatrix();
       pjs.translate( pjs.width * 0.7, pjs.height * 0.3 );
       pjs.rotateY( angleY );
       pjs.fill( 255, 0, 0 );
       pjs.sphereDetail( 30 );
       pjs.sphere( 75 );
       pjs.popMatrix();
       pjs.pushMatrix();
       pjs.translate( pjs.width * 0.3, pjs.height * 0.7 );
       pjs.rotateY( angleY );
       pjs.fill( 255, 255, 0 );
       pjs.sphereDetail( 6 );
       pjs.sphere( 75 );
       pjs.popMatrix();
       pjs.pushMatrix();
       pjs.translate( pjs.width * 0.7, pjs.height * 0.7 );
       pjs.rotateY( angleY );
       pjs.fill( 255, 0, 255 );
       pjs.sphereDetail( 4, 20 );
       pjs.sphere( 75 );
       pjs.popMatrix();
     }

     pjs.keyPressed = function() {
       if(pjs.key == 97) {
          flagStroke = !flagStroke;
       }
     }

   // kickstart the sketch
   pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});

