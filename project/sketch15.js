/*

float x;
float z;
void setup(){
size( 640, 480, OPENGL );
  x = 0;
  z = 0;
  noStroke();
}

void draw() {
background( 255 );
lights();
beginShape();
fill( 255, 0, 0 );
vertex( 0, height, 0);
fill( 255, 255, 0 );
vertex( 0, height, -1000 );
fill( 0, 255, 0 );
vertex( width, height, -1000 );
fill( 0, 0, 255 );
vertex( width, height, 0 );
endShape(CLOSE);
fill( 255 );
pushMatrix();
translate( width/2, height-50, -500 );
box( 100 );
popMatrix();
x = cos( radians( frameCount ) ) * 1000;
z = sin( radians( frameCount ) ) * 1000;
camera( x, 0, z, width/2, height-50, -500, 0, 1, 0 );

}


*/

(function(){
  "use strict";

  var envirposits = {x:0, y:0, z:0};
  var limit = 500;
  var envirlimits = {xmin:-limit, xmax:limit, ymin:-limit, ymax:limit, zmin:-limit, zmax:limit};

  var canvas = document.getElementById('glibcanvas');
  var pjs = new Processing(canvas);

  var legend = document.getElementById('legend');
  var txtlegend = '<p>Use the "z" and "s" keys, to move on the y axis.</p>';
  legend.innerHTML = txtlegend;

  var camX, camZ, camY;

  pjs.setup = function() {
    pjs.size(600, 480, pjs.OPENGL);
    camX = 0.0;
    camY = 0.0;
    camZ = 0.0;
    pjs.noStroke();
    pjs.loop();
  }

  pjs.draw = function() {

    pjs.background( 255 );
    pjs.lights();

    camY = envirposits.y;
    camX = pjs.cos( pjs.radians( pjs.frameCount ) ) * 1000;
    camZ = pjs.sin( pjs.radians( pjs.frameCount ) ) * 1000;
    pjs.camera( camX, camY, camZ, pjs.width/2, pjs.height-50, -500, 0, 1, 0 );

    pjs.beginShape();
    pjs.fill( 255, 0, 0 );
    pjs.vertex( 0, pjs.height, 0);
    pjs.fill( 255, 255, 0 );
    pjs.vertex( 0, pjs.height, -1000 );
    pjs.fill( 0, 255, 0 );
    pjs.vertex( pjs.width, pjs.height, -1000 );
    pjs.fill( 0, 0, 255 );
    pjs.vertex( pjs.width, pjs.height, 0 );
    pjs.endShape(pjs.CLOSE);
    pjs.fill( 255 );
    pjs.pushMatrix();
    pjs.translate( pjs.width/2, pjs.height-50, -500 );
    pjs.box( 100 );
    pjs.popMatrix();
  }

  pjs.keyPressed = function(){
    let touchkey = String(pjs.key).toLowerCase();
    let touchcode = pjs.keyCode;

    if (touchkey == 'z') {
      envirposits.y -= 10;
      if (envirposits.y < envirlimits.ymin) {
        envirposits.y = envirlimits.ymin;
      }
    } else {
      if (touchkey == 's') {
        envirposits.y += 10;
        if (envirposits.y > envirlimits.ymax) {
          envirposits.y = envirlimits.ymax;
        }
     }
   }
  }
   // kickstart the sketch
   pjs.setup();
})();
