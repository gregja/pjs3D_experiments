var pjs = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

    let width = 600;
    let height = 400;
    let speedSlider;
    let boxSizeSlider;
    let rotAngle = 0;
    let edgeLength = 0;
    let maxOffset = width / 2;

    var data_form = {};  // store live parameters (attached to form fields)

    function colorPart(offset) {
        return pjs.map(offset, -maxOffset, maxOffset, 0, 255)
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
        let rpFrame = rps / (pjs.frameCount === 1 ? 1 : pjs.frameRate());
        rotAngle = (rotAngle + rpFrame * pjs.TWO_PI) % pjs.TWO_PI;
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

    pjs.setup = function() {
        pjs.size(width, height, pjs.P3D);
        pjs.frameRate(10);
        pjs.loop();
    }

    pjs.draw = function() {
        pjs.background(255);
    //    pjs.lights();

    //    pjs.pushMatrix();

        pjs.translate(0, 0, -1500);
        pjs.rotateX(pjs.QUARTER_PI);
        pjs.rotateY(rotAngle);
        setNextRotationChange();

        edgeLength = parseInt(data_form['pjs_size']);

        forRange(x => forRange(y => forRange(z => {
            pjs.pushMatrix();
            pjs.translate(x, y, z);
            pjs.fill(colorPart(x), colorPart(y), colorPart(z));
            pjs.box(edgeLength);
            pjs.popMatrix();
        })));

    //    pjs.popMatrix();

        pjs.noLoop(); // un bug rencontré sur ce sketch (non résolu) m'a obligé à placer ici un arrêt de la boucle
    }

    pjs.keyPressed = function() {
       let key = String(pjs.key).toLowerCase();
       if (key == 'x') {
           pjs.noLoop();
       }
   }

    // kickstart the pjs
    pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the pjs when the DOM is ready (best practice)");
  pjs('glibcanvas');
});
