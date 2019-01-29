var sketch = function( dom_canvas ) {
  "use strict";

  var envirposits = {x:0, y:0, z:0};
  var limit = 500;
  var envirlimits = {xmin:-limit, xmax:limit, ymin:-limit, ymax:limit, zmin:-limit, zmax:limit};

  var canvas = document.getElementById(dom_canvas);
  var pjs = new Processing(canvas);

  var legend = document.getElementById('legend');
  var txtlegend = '<p>Use Arrow keys + "z" and "s" keys, to move into the space.</p>';
  legend.innerHTML = txtlegend;

  var n;

  pjs.setup = function() {
    pjs.size(600, 480, pjs.OPENGL);
    n = 0.0;
    pjs.loop();
  }

  pjs.draw = function() {
      pjs.hint( pjs.ENABLE_DEPTH_TEST );
      n += 0.01;
      pjs.background( 255 );
      pjs.lights();
      pjs.noStroke();
      pjs.fill( 255, 128, 0 );
      pjs.pushMatrix();
      for ( let i = 0; i < 17; i++ ) {
        for ( let j = 0; j < 13; j++ ) {
          pjs.pushMatrix();
          pjs.fill( i * 15, 0, j * 19 );
          pjs.translate( i * 40 + envirposits.x, j * 40+ envirposits.y, envirposits.z );
          pjs.rotateY( pjs.radians( i * 10 + pjs.frameCount ) );
          pjs.rotateZ( pjs.radians( i * 10 + pjs.frameCount ) );
          pjs.box( pjs.noise( i, j, n ) * 40 );
          pjs.popMatrix();
        }
      }
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

    switch ( touchcode ) {
      case pjs.UP:{
        envirposits.z -= 10;
        if (envirposits.z < envirlimits.zmin) {
          envirposits.z = envirlimits.zmin;
        }
        break;
      }
      case pjs.RIGHT:{
        envirposits.x += 10;
        if (envirposits.x > envirlimits.xmax) {
          envirposits.x = envirlimits.xmax;
        }
        break;
      }
      case pjs.DOWN:{
        envirposits.z += 10;
        if (envirposits.z > envirlimits.zmax) {
          envirposits.z = envirlimits.zmax;
        }
        break;
      }
      case pjs.LEFT:{
        envirposits.x -= 10;
        if (envirposits.x < envirlimits.xmin) {
          envirposits.x = envirlimits.xmin;
        }
        break;
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
