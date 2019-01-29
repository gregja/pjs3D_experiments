var sketch = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    if (!canvas) {
        console.warn('Canvas not found');
        return;
    }

    // pjs.js will use this function as the body of the sketch,
    // and pass us a processing instance, which we can use to attach
    // things like setup() and draw(), and to access all the various
    // Processing types, functions and values.
    var sketchBody = function(pjs) {

        var x = 0;
        var y = 0;
        var dim = 80;

        var xoutput = document.getElementById('xoutput');
        if (!xoutput) {
            console.warn('Div not found with id "xoutput" ');
            return;
        }

        var xvalue = document.getElementById('xvalue');
        if (!xvalue) {
            console.warn('Input not found with id "xvalue" ');
            return;
        }

        var xupdate = document.getElementById('xupdate');
        if (!xupdate) {
            console.warn('Button not found with id "xupdate" ');
            return;
        } else {
            xupdate.addEventListener('click', function(evt) {
                x = parseInt(xvalue.value);
            }, false);
        }

        pjs.setup = function() {
            pjs.size(640, 360);
            pjs.noStroke();
        }

        pjs.draw = function() {
            pjs.background(102);
            x = x + 0.8;
            if (x > pjs.width + dim) {
                x = -dim;
            }
            pjs.translate(x, pjs.height/2-dim/2);
            pjs.fill(255);
            pjs.rect(-dim/2, -dim/2, dim, dim);
            // Transforms accumulate. Notice how this rect moves
            // twice as fast as the other, but it has the same
            // parameter for the x-axis value
            pjs.translate(x, dim);
            pjs.fill(0);
            pjs.rect(-dim/2, -dim/2, dim, dim);

            xoutput.innerHTML = "x=" + x;
        }
    };

    // Wrap our code in a Processing.Sketch object to setup the
    // rest of the bits we'll need later.  It takes a function that
    // accepts one argument, a processing instance.
    var sketch1 = new Processing.Sketch(sketchBody);

    // Pass in the 'id' of the canvas (or the canvas element itself)
    // and a pjs.Sketch object.
    var processingInstance = new Processing(canvas, sketch1);

};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});
