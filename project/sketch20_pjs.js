var sketch = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

    var mid_width = 300;
    var mid_height = mid_width;

    pjs.setup = function() {
      pjs.size(mid_width*2, mid_height*2, pjs.P3D);
      pjs.loop();
    }

    pjs.draw = function() {

      pjs.background(50);
      //move your mouse to change light position
      let locX = pjs.mouseX - mid_width ;
      let locY = pjs.mouseY - mid_height;

      pjs.translate(mid_width, mid_height);
      pjs.pointLight(250, 250, 250, locX, locY, 50);
      pjs.ambientLight(153, 102, 0);
      pjs.ambient(51, 26, 0);
      pjs.noStroke();
      pjs.sphere(150);

    }

    // kickstart the sketch
    pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});
