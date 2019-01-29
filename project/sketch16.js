var sketch = function( dom_canvas ) {
  "use strict";

  var canvas = document.getElementById(dom_canvas);
  var pjs = new Processing(canvas);

  var texture1;
  var texture2;

// preload ne fonctionne pas dans ce mode d'exécution
/* @pjs preload="assets/texture1.jpg, assets/texture2.jpg"; */

  pjs.setup = function(){
    pjs.size( 640, 480, pjs.OPENGL );
    pjs.noStroke();
    // textures from https://freestocktextures.com
    texture1 = pjs.loadImage("assets/texture1.jpg");
    texture2 = pjs.loadImage("assets/texture2.jpg");
    pjs.noLoop();

    // setTimeout nécessaire pour laisser au navigateur le temps de charger les images
    // ça fonctionne mais ce n'est certainement pas la meilleure façon de faire,
    // solution à améliorer (TODO)
    setTimeout(function() {
      pjs.loop();
    }, 1000);
  }

  pjs.draw = function() {
    pjs.background( 255 );

    pjs.textureMode( pjs.IMAGE );
    pjs.pushMatrix();
    pjs.translate( pjs.width/4, pjs.height/2, 0 );
    pjs.rotateY( pjs.radians( pjs.frameCount ) );
    pjs.beginShape();
    pjs.texture( texture1 );
    pjs.vertex( -100, -100, 0, 0 );
    pjs.vertex( 100, -100, 640, 0 );
    pjs.vertex( 100, 100, 640, 640 );
    pjs.vertex( -100, 100, 0, 640 );
    pjs.endShape( pjs.CLOSE );
    pjs.popMatrix();

    pjs.textureMode( pjs.NORMAL );
    pjs.pushMatrix();
    pjs.tint(0, 180, 255, 126); // ajout couleur bleue + transparence
    pjs.translate( pjs.width*.75, pjs.height/2, 0 );
    pjs.rotateY( pjs.radians( -pjs.frameCount ) );
    pjs.beginShape();
    pjs.texture( texture2 );
    pjs.vertex( -100, -100, 0, 0 );
    pjs.vertex( 100, -100, 1, 0 );
    pjs.vertex( 100, 100, 1, 1 );
    pjs.vertex( -100, 100, 0, 1 );
    pjs.endShape( pjs.CLOSE );
    pjs.popMatrix();
  }

   // kickstart the sketch
   pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});
