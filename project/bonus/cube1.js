/* http://jsfiddle.net/jw66Lmhf/9/ */

var sketch = function( dom_canvas ) {
    "use strict";

    function genCube(scale) {
        scale = scale || 100;
        var shape = [];

        shape.push([-1 * scale, -1 * scale, 1 * scale, 0, 0]);
        shape.push([1 * scale, -1 * scale, 1 * scale, 1, 0]);
        shape.push([1 * scale, 1 * scale, 1 * scale, 1, 1]);
        shape.push([-1 * scale, 1 * scale, 1 * scale, 0, 1]);

        // -Z "back" face
        shape.push([1 * scale, -1 * scale, -1 * scale, 0, 0]);
        shape.push([-1 * scale, -1 * scale, -1 * scale, 1, 0]);
        shape.push([-1 * scale, 1 * scale, -1 * scale, 1, 1]);
        shape.push([1 * scale, 1 * scale, -1 * scale, 0, 1]);

        // +Y "bottom" face
        shape.push([-1 * scale, 1 * scale, 1 * scale, 0, 0]);
        shape.push([1 * scale, 1 * scale, 1 * scale, 1, 0]);
        shape.push([1 * scale, 1 * scale, -1 * scale, 1, 1]);
        shape.push([-1 * scale, 1 * scale, -1 * scale, 0, 1]);

        // -Y "top" face
        shape.push([-1 * scale, -1 * scale, -1 * scale, 0, 0]);
        shape.push([1 * scale, -1 * scale, -1 * scale, 1, 0]);
        shape.push([1 * scale, -1 * scale, 1 * scale, 1, 1]);
        shape.push([-1 * scale, -1 * scale, 1 * scale, 0, 1]);

        // +X "right" face
        shape.push([1 * scale, -1 * scale, 1 * scale, 0, 0]);
        shape.push([1 * scale, -1 * scale, -1 * scale, 1, 0]);
        shape.push([1 * scale, 1 * scale, -1 * scale, 1, 1]);
        shape.push([1 * scale, 1 * scale, 1 * scale, 0, 1]);

        // -X "left" face
        shape.push([-1 * scale, -1 * scale, -1 * scale, 0, 0]);
        shape.push([-1 * scale, -1 * scale, 1 * scale, 1, 0]);
        shape.push([-1 * scale, 1 * scale, 1 * scale, 1, 1]);
        shape.push([-1 * scale, 1 * scale, -1 * scale, 0, 1]);

        return shape;
    }

    var cube = new genCube(100);

    var canvas = document.getElementById(dom_canvas);
    if (!canvas) {
        console.warn('Canvas tag not found in the DOM, failed to start ProcessingJS');
        return;
    }
    var pjs = new Processing(canvas);

    var frontToBack = true;
    var shift = 0;
    var color = "#affaff";
    var colpicker = document.getElementById("colorpicker");
    if (colpicker) {
        colpicker.value = color;
        colpicker.addEventListener('change', function(evt) {
            color = this.value;
            console.log(color);
        }, false);
    } else {
        console.warn('color picker not found');
    }

    var mid_size = 200;

    pjs.setup = function () {
        pjs.size(mid_size*2, mid_size*2, pjs.OPENGL);
        pjs.frameRate(30);
        pjs.strokeWeight(10, 10, 10, 10);
        pjs.loop();
    };

    pjs.draw = function () {
        pjs.background(255, 255, 150);
        //pjs.lights();
        pjs.beginShape(pjs.QUADS);

        cube.map(item => {
            pjs.vertex(item[0], item[1], item[2], item[3], item[4]);
        });

        pjs.translate(mid_size, mid_size, -shift*100);

        pjs.rotateX(-shift);
        pjs.rotateY(-shift);
        pjs.rotateZ(shift);
        pjs.endShape();

        let xcolor = hexToRgb(color);
        pjs.fill(xcolor.r, xcolor.g, xcolor.b);

        if (frontToBack) {
            shift += 0.01;
        } else {
            shift -= 0.01;
        }
        if (shift >= 6) {
            frontToBack = false;
        } else if (shift <= 0) {
            frontToBack = true;
        }
    };

    function hexToRgb(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
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
    