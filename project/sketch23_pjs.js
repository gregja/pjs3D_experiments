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
        pjs.background(204);

        let x = pjs.mouseX;
        let y = pjs.mouseY;
        let z = -100;

        // Draw "X" at z = -100
        pjs.stroke(255);
        pjs.line(x-10, y-10, z, x+10, y+10, z);
        pjs.line(x+10, y-10, z, x-10, y+10, z);

        // Draw lines in 2D at same x and y values
        // Notice the parallax
        pjs.stroke(102);
        pjs.line(x, 0, 0, x, pjs.height, 0);
        pjs.line(0, y, 0, pjs.width, y, 0);

        // Draw 2D lines to match the x and y values
        // elements drawn at z = -100
        pjs.stroke(0);
        let theX = pjs.screenX(x, y, z);
        pjs.line(theX, 0, 0, theX, pjs.height, 0);
        let theY = pjs.screenY(x, y, z);
        pjs.line(0, theY, 0, pjs.width, theY, 0);

        // pjs.screenZ(x,y,z)  => function not used here but available for other contexts
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
