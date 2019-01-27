var sketch = function( dom_canvas ) {
  "use strict";

  var canvas = document.getElementById(dom_canvas);
  var pjs = new Processing(canvas);


    var depth, zSpeed;
    var squareSize = 80;

    pjs.setup = function() {
       pjs.size(640, 480, pjs.OPENGL);
       pjs.smooth();
       depth = 0;
       zSpeed = -10;
       pjs.loop();
     }

     pjs.draw = function() {
       //pjs.background(204);
       depth += zSpeed;
       if (depth <= -1000 || depth >= 0) {
         zSpeed *= -1;
       }
       pjs.background(255);
       pjs.noFill();
       pjs.stroke(0);
       for (let i=0; i<10; i++) {
         pjs.pushMatrix();
         pjs.translate(0, 0, -i * 100);
         pjs.rect(0, 0, pjs.width, pjs.height);
         pjs.popMatrix();
       }

       pjs.pushMatrix();
       pjs.translate( 0, 0, depth );
       pjs.fill( 255, 0, 0 ); // rouge
       pjs.rect( 0, 0, squareSize, squareSize );

       pjs.fill( 0, 255, 0 ); // vert
       pjs.rect( pjs.width-squareSize, 0, squareSize, squareSize );

       pjs.fill( 255, 255, 0 ); // jaune
       pjs.rect( pjs.width-squareSize, pjs.height-squareSize, squareSize, squareSize );

       pjs.fill( 0, 255, 255 );  // bleu
       pjs.rect( 0, pjs.height-squareSize, squareSize, squareSize );

       pjs.popMatrix();

     }


   // kickstart the sketch
   pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});

