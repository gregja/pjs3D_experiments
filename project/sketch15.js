var sketch = function( dom_canvas ) {
  "use strict";

  var envirposits = {x:0, y:0, z:0};
  var limit = 500;
  var envirlimits = {xmin:-limit, xmax:limit, ymin:-limit, ymax:limit, zmin:-limit, zmax:limit};

  var canvas = document.getElementById(dom_canvas);
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
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});
