var pjs = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

    var mid_width = 250;
    var mid_height = mid_width;
    var mode = 1; // display both boxes by default

    pjs.setup = function() {
        pjs.size(mid_width * 2, mid_height * 2, pjs.P3D);
        pjs.noFill();
        pjs.loop();
    }

    pjs.draw = function() {
        pjs.background(0);

        pjs.pushMatrix();
        // start at the middle of the screen
        pjs.translate(mid_width, mid_height, -200);
        // some random rotation to make things interesting
        pjs.rotateY(1.0);
        pjs.rotateZ(2.0);
        // rotate in X a little more each frame
        pjs.rotateX(pjs.frameCount / 100.0);
        // offset from center
        pjs.translate(0, 150, 0);

        // scale isn't recorded by the model? functions
        pjs.scale(2);

        // draw a white box outline at (0, 0, 0)
        pjs.stroke(255);
        pjs.noFill();
        pjs.box(50);

        // the box was drawn at (0, 0, 0), store that location
        let x = pjs.modelX(0, 0, 0);
        let y = pjs.modelY(0, 0, 0);
        let z = pjs.modelZ(0, 0, 0);

        // clear out all the transformations
        pjs.popMatrix();

        if (mode == 2) {
            // draw another box at the same (x, y, z) coordinate as the other
            pjs.pushMatrix();
            pjs.translate(x, y, z);
            pjs.stroke(255, 0, 0);
            pjs.fill('yellow');
            pjs.box(50);
            pjs.popMatrix();
        }
    }

    pjs.keyPressed = function() {
       let key = String(pjs.key).toLowerCase();
       if (key == 'a') {
           mode = 1;
       } else {
           if (key == 'b') {
               mode = 2;
           }
       }
   }

    // kickstart the pjs
    pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the pjs when the DOM is ready (best practice)");
  pjs('glibcanvas');
});
