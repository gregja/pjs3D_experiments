var s = function( sketch ) {
    "use strict";

    var mid_width = 300;
    var mid_height = mid_width;

    sketch.setup = function() {
      let c = sketch.createCanvas(mid_width*2, mid_height*2, sketch.WEBGL);
      c.parent('#glibcanvas'); // necessary for attach the canvas where you want into the DOM
    }

    sketch.draw = function() {

      sketch.background(0);
      //move your mouse to change light position
      let dirX = (sketch.mouseX / sketch.width - 0.5) * 2;
      let dirY = (sketch.mouseY / sketch.height - 0.5) * 2;

      // to set the light position,
      // think of the world's coordinate as:
      // -width/2,-height/2 -------- width/2,-height/2
      //                |            |
      //                |     0,0    |
      //                |            |
      // -width/2,height/2--------width/2,height/2

      //sketch.translate(mid_width, mid_height);
      sketch.directionalLight(250, 250, 250, -dirX, -dirY, 0.25);
      sketch.ambientMaterial(250);
      sketch.noStroke();
      sketch.sphere(150);

    }
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    var myp5 = new p5(s);
});
