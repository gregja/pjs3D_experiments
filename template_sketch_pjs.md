
Put a CANVAS tag in your HTML page, like in the example below :
        <canvas id="glibcanvas"></canvas>

Template for a ProcessingJS sketch :

var sketch = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    if (!canvas) {
      console.warn('Canvas tag not found in the DOM, failed to start ProcessingJS');
      return;
    }
    var pjs = new Processing(canvas);

    var mid_width = 400;  // it's often very useful to know the coordinates of the center of the canvas
    var mid_height = 300; // it's often very useful to know the coordinates of the center of the canvas

    var ctx = null; // pointer to the 2D and 3D context of ProcessingJS (to declare only if you need it)

    pjs.setup = function() {
        pjs.size(mid_width * 2, mid_height * 2, pjs.P3D);

        ctx = pjs.externals.context; // hook to the 2D and 3D context (only if you use WEBGL)

        // put your code here

        pjs.loop(); // the call to loop is implicit with P5 but not with ProcessingJS
    }

    pjs.draw = function() {
        pjs.background( 255 );

        pjs.pushMatrix();
        pjs.translate(mid_width, mid_height); // translate to the middle of the canvas is mandatory with ProcessingJS

        // put your code here

        pjs.popMatrix();
    }

    pjs.mouseMoved = function() {
        // put your code here (maybe you don't need mouseMoved function, it's just an example)
    };

    pjs.keyPressed = function(){
        let key = String(pjs.key).toLowerCase();
        if (key == 'x') {
            console.warn('Stop the loop');  // very useful when there is a bug
            pjs.noLoop();
        }
    }

    // kickstart the sketch
    pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    sketch('glibcanvas');  // use the same ID you declared in the HTML page
});
