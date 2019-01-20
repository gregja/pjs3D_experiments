/*

void setup(){
  size( 640, 480, OPENGL );
}

void draw() {

  background( 255 );
  lights();
  pushMatrix();
  translate( width/2, height/2, 0 );
  rotateY( radians( frameCount ) );
  pushMatrix();
  rotateZ( radians( frameCount ) );
  fill( 255, 0, 0 );
  beginShape( TRIANGLE_STRIP );
  for ( int i = 0; i < 20; i++ )
    float x1 = cos( radians( i * 10 ) ) * 100;
    float y1 = sin( radians( i * 10 ) ) * 100;
    float x2 = cos( radians( i * 10 + 5 ) ) * ( 180 - i * 4 );
    float y2 = sin( radians( i * 10 + 5 ) ) * ( 180 - i * 4 );
    vertex( x1, y1, 0 );
    vertex( x2, y2, 50 + i );
  }
  endShape();
  popMatrix();

  pushMatrix();
  translate( 0, 0, -100 );
  rotateZ( radians( -frameCount ) );
  fill( 255, 255, 0 );
  beginShape( QUAD_STRIP );
  for ( int i = 0; i < 20; i++
    float x1 = cos( radians( i * 10 ) ) * ( 100 + i * 5);
    float y1 = sin( radians( i * 10 ) ) * ( 100 + i * 5);
    float x2 = cos( radians( i * 10 + 5 ) ) * 180;
    float y2 = sin( radians( i * 10 + 5 ) ) * 180;

    vertex( x1, y1, 0 );
    vertex( x2, y2, 80 + i * 2 );
  }
  endShape();
  popMatrix();
  popMatrix();
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
  var txtlegend = '<p>Use Arrow keys + "z" and "s" keys, to move into the space.</p>';
  legend.innerHTML = txtlegend;

  var n;

  pjs.setup = function() {
    pjs.size(600, 480, pjs.OPENGL);
    n = 0.0;
    pjs.loop();
  }

  pjs.draw = function() {

    pjs.background( 255 );
    pjs.lights();
    pjs.pushMatrix();
    pjs.translate( pjs.width/2+envirposits.x, pjs.height/2+envirposits.y, envirposits.z );
    pjs.rotateY( pjs.radians( pjs.frameCount ) );
    pjs.pushMatrix();
    pjs.rotateZ( pjs.radians( pjs.frameCount ) );
    pjs.fill( 255, 0, 0 );
    pjs.beginShape( pjs.TRIANGLE_STRIP );
    for ( let i = 0; i < 20; i++ ) {
      let x1 = pjs.cos( pjs.radians( i * 10 ) ) * 100;
      let y1 = pjs.sin( pjs.radians( i * 10 ) ) * 100;
      let x2 = pjs.cos( pjs.radians( i * 10 + 5 ) ) * ( 180 - i * 4 );
      let y2 = pjs.sin( pjs.radians( i * 10 + 5 ) ) * ( 180 - i * 4 );
      pjs.vertex( x1, y1, 0 );
      pjs.vertex( x2, y2, 50 + i );
    }
    pjs.endShape();
    pjs.popMatrix();

    pjs.pushMatrix();
    pjs.translate( 0, 0, -100 );
    pjs.rotateZ( pjs.radians( -pjs.frameCount ) );
    pjs.fill( 255, 255, 0 );
    pjs.beginShape( pjs.QUAD_STRIP );
    for ( let i = 0; i < 20; i++) {
      let x1 = pjs.cos( pjs.radians( i * 10 ) ) * ( 100 + i * 5);
      let y1 = pjs.sin( pjs.radians( i * 10 ) ) * ( 100 + i * 5);
      let x2 = pjs.cos( pjs.radians( i * 10 + 5 ) ) * 180;
      let y2 = pjs.sin( pjs.radians( i * 10 + 5 ) ) * 180;

      pjs.vertex( x1, y1, 0 );
      pjs.vertex( x2, y2, 80 + i * 2 );
    }
    pjs.endShape();
    pjs.popMatrix();
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
})();
