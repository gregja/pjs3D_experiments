var s = function( sketch ) {
    "use strict";

    let width = 600;
    let height = 400;
    let speedSlider;
    let boxSizeSlider;
    let rotAngle = 0;
    let edgeLength = 0;
    let maxOffset = width / 2;

    var data_form = {};  // store live parameters (attached to form fields)

    function colorPart(offset) {
        return sketch.map(offset, -maxOffset, maxOffset, 0, 255)
    }

    function forRange(fn) {
        let cubeSpacing = parseInt(data_form['pjs_size']) * 1.2;
        for (let arg = -maxOffset; arg <= maxOffset; arg += cubeSpacing) {
            fn(arg);
        }
    }

    function setNextRotationChange() {
        let rpm = parseInt(data_form['pjs_rpm']);
        let rps = rpm / 60.0;
        let rpFrame = rps / (sketch.frameCount === 1 ? 1 : sketch.frameRate());
        rotAngle = (rotAngle + rpFrame * sketch.TWO_PI) % sketch.TWO_PI;
    }

    var slider_callback = function (self) {
      data_form[self.id] = parseInt(self.value);
      return null;
    }

    // list of filters to generate as field forms
    var filters = [];   // rpm, size
    filters.push({field:"rpm", min:1, max:60, value:5, step:1, label:"RPM", callback:slider_callback});
    filters.push({field:"size", min:50, max:400, value:100, step:1, label:"Size", callback:slider_callback});

    // generate form fields
    multiSliders('form', filters, data_form);

    sketch.setup = function() {
        let c = sketch.createCanvas(width, height, sketch.WEBGL);
        c.parent('#glibcanvas'); // necessary for attach the canvas where you want into the DOM
        sketch.loop();
    }

    sketch.draw = function() {
        sketch.background(255);

        sketch.translate(0, 0, -1500);
        sketch.rotateX(sketch.QUARTER_PI);
        sketch.rotateY(rotAngle);
        setNextRotationChange();

        edgeLength = parseInt(data_form['pjs_size']);

        forRange(x => forRange(y => forRange(z => {
            sketch.push();
            sketch.translate(x, y, z);
            sketch.fill(colorPart(x), colorPart(y), colorPart(z));
            sketch.box(edgeLength);
            sketch.pop();
        })));

    }

    sketch.keyPressed = function() {
        let xKey = String(sketch.key).toLowerCase();
        if (xKey == 'x') {
            sketch.noLoop();
        }
    }

};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    var myp5 = new p5(s);

});
