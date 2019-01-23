
(function(){
  "use strict";

  var canvas = document.getElementById('glibcanvas');
  var pjs = new Processing(canvas);

  var texture1;
  var texture2;

// preload ne fonctionne pas dans ce mode d'exécution
/* @pjs preload="assets/texture1.jpg, assets/texture2.jpg"; */

// count , radius , twist, hcount, phase, hradius
  var data_form = {};

  var vertx = [];
  var verty = [];

  var pjs_form = document.querySelectorAll("[data-form]");
  [].forEach.call(pjs_form, item => {
      data_form[item.id] = item.value;
      item.addEventListener('change', function(evt) {
      let output = document.querySelector(`[data-name=${this.id}]`);
      data_form[this.id] = this.value;
      output.value = this.value;
    }, false)
  });

  function getR( a, v1, v2 ) {
    return pjs.sin( pjs.radians(a) * v1 ) * v2 + 100;
  }
  function initPoints(v1, v2) {
    for( let a = 0; a < 72; a++) {
      vertx[a] = pjs.cos( pjs.radians( a * 5.0 )) * getR( a * 5.0, v1, v2 );
      verty[a] = pjs.sin( pjs.radians( a * 5.0 )) * getR( a * 5.0, v2, v2 );
    }
  }

  pjs.setup = function(){
    pjs.size( 400, 400, pjs.OPENGL );
    pjs.loop();
  }

  pjs.draw = function() {

    pjs.pushMatrix();
    pjs.background(255);
    pjs.translate( pjs.width/2, pjs.height/2 );
    pjs.noFill();
    initPoints(data_form.pjs_count, data_form.pjs_radius);
    pjs.beginShape();
    for( let a = 0; a < 72; a++) {
      pjs.vertex( vertx[a], verty[a] );
    }
    pjs.vertex( vertx[0], verty[0] );
    pjs.endShape();
    pjs.popMatrix();

  }

   // kickstart the sketch
   pjs.setup();
})();
