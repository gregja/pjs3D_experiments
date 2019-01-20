/*
void cylinder( int numSegments, float h, float r )
{
float angle = 360.0 / (float)numSegments;
// top
beginShape();
for ( int i = 0; i < numSegments; i++ ) {
float x = cos( radians( angle * i ) ) * r;
float y = sin( radians( angle * i ) ) * r;
vertex( x, y, -h/2 );
}
endShape( CLOSE );
// side
beginShape( QUAD_STRIP );
for ( int i = 0; i < numSegments + 1; i++ ) {
float x = cos( radians( angle * i ) ) * r;
float y = sin( radians( angle * i ) ) * r;
vertex( x, y, -h/2 );
vertex( x, y, h/2 );
}
endShape();
// bottom
beginShape();
for ( int i = 0; i < numSegments; i++ ) {
float x = cos( radians( angle * i ) ) * r;
float y = sin( radians( angle * i ) ) * r;
vertex( x, y, h/2 );
}
endShape( CLOSE );
}

background( 255 );
pushMatrix();
translate( width*.3, height*.3, 0 );
rotateY( radians( frameCount ) );
fill( 255, 0, 0 );
cylinder( 30, 100, 50 );
popMatrix();
pushMatrix();
translate( width*.7, height*.5, 0 );
rotateY( radians( frameCount ) );
fill( 255, 255, 0 );
cylinder( 4, 200, 50 );
popMatrix();
pushMatrix();
translate( width*.3, height*.7, 0 );
rotateY( radians( frameCount ) );
fill( 0, 0, 255 );
cylinder( 3, 200, 30 );
popMatrix();

*/

(function(){
  "use strict";

  var modes = [];
  modes.push({key:'a', 'mode': 'Top - Side - Bottom', value:0});
  modes.push({key:'b', 'mode': 'Top only', value:1});
  modes.push({key:'c', 'mode': 'Side only', value:2});
  modes.push({key:'d', 'mode': 'Bottom only', value:3});

  var envirposits = {x:0, y:0, z:0};
  var limit = 500;
  var envirlimits = {xmin:-limit, xmax:limit, ymin:-limit, ymax:limit, zmin:-limit, zmax:limit};

  var canvas = document.getElementById('glibcanvas');
  var pjs = new Processing(canvas);

  class Cylinder {
    constructor(numSegments, h, r ){
      this.segments = numSegments;
      this.h = h;
      this.r = r;
      this.angle = 360.0 / this.segments;
    }
    render(mode) {
      // top
      if (mode == 0 || mode == 1) {
        pjs.beginShape();
          for ( let i = 0; i < this.segments; i++ ) {
            let x = pjs.cos( pjs.radians( this.angle * i ) ) * this.r;
            let y = pjs.sin( pjs.radians( this.angle * i ) ) * this.r;
            pjs.vertex( x, y, -this.h/2 );
          }
        pjs.endShape( pjs.CLOSE );
      }
      // side
      if (mode == 0 || mode == 2) {
        pjs.beginShape( pjs.QUAD_STRIP );
        for ( let i = 0; i < this.segments + 1; i++ ) {
          let x = pjs.cos( pjs.radians( this.angle * i ) ) * this.r;
          let y = pjs.sin( pjs.radians( this.angle * i ) ) * this.r;
          pjs.vertex( x, y, -this.h/2 );
          pjs.vertex( x, y, this.h/2 );
        }
        pjs.endShape();
      }
      // bottom
      if (mode == 0 || mode == 3) {
        pjs.beginShape();
          for ( let i = 0; i < this.segments; i++ ) {
            let x = pjs.cos( pjs.radians( this.angle * i ) ) * this.r;
            let y = pjs.sin( pjs.radians( this.angle * i ) ) * this.r;
            pjs.vertex( x, y, pjs.h/2 );
        }
        pjs.endShape( pjs.CLOSE );
      }
    }
  }

  var renderMode = 0;
  var cylinder1 = new Cylinder( 30, 100, 50 );
  var cylinder2 = new Cylinder( 4, 200, 50 );
  var cylinder3 = new Cylinder( 3, 200, 30 );

  var legend = document.getElementById('legend');
  var txtlegend = '<p>Click on the graph before to use the render modes below.</p>'+
                  '<p>Use Arrow keys + "z" and "s" keys, to move into the space.</p>'+
                  '<p>Render modes associated to the keyboard:</p><ul>';
  modes.forEach(item => {
    txtlegend += `<li>${item.key.toUpperCase()} : ${item.mode}</li>`;
  });
  txtlegend += '</ul>';
  legend.innerHTML = txtlegend;

  var current_mode = document.getElementById('current_mode');
  current_mode.innerHTML = `<p>Current Mode : ${modes.find(item => item.value == renderMode).mode}</p>`;


  pjs.setup = function() {
    pjs.size(600, 600, pjs.P3D);
    pjs.loop();
    console.log(pjs.externals.context);
//    pjs.hint(pjs.ENABLE_OPENGL_4X_SMOOTH);
//    pjs.hint(pjs.DISABLE_OPENGL_2X_SMOOTH);
pjs.hint(pjs.ENABLE_OPENGL_ERROR_REPORT);
  }

  pjs.draw = function() {
    pjs.background( 255 );

    pjs.pushMatrix();
    pjs.translate( pjs.width*.3 + envirposits.x, pjs.height*.3 + envirposits.y, envirposits.z );
    pjs.rotateY( pjs.radians( pjs.frameCount ) );
    pjs.fill( 255, 0, 0 );
    cylinder1.render(renderMode);
    pjs.popMatrix();

    pjs.pushMatrix();
    pjs.translate( pjs.width*.7 + envirposits.x, pjs.height*.5 + envirposits.y, envirposits.z );
    pjs.rotateY( pjs.radians( pjs.frameCount ) );
    pjs.fill( 255, 255, 0 );
    cylinder2.render(renderMode);
    pjs.popMatrix();

    pjs.pushMatrix();
    pjs.translate( pjs.width*.3 + envirposits.x, pjs.height*.7 + envirposits.y, envirposits.z );
    pjs.rotateY( pjs.radians( pjs.frameCount ) );
    pjs.fill( 0, 0, 255 );
    cylinder3.render(renderMode);
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
      } else {
        let check = modes.find(item => item.key == touchkey);
        if (check && check.value != renderMode) {
          renderMode = check.value;
          current_mode.innerHTML = `<p>Current Mode : ${modes.find(item => item.value == renderMode).mode}</p>`;
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
