var s = function( sketch ) {
    "use strict";

    var obj3d = [];
    var cur_obj = 0;

    sketch.preload = function() {
        obj3d[0] = sketch.loadModel('assets/shuttle.obj', true);
        obj3d[1] = sketch.loadModel('assets/icosahedron.obj', true);
        obj3d[2] = sketch.loadModel('assets/diamond.obj', true);
    }

    sketch.setup = function() {
        let c = sketch.createCanvas(800, 600, sketch.WEBGL);
        c.parent('#glibcanvas'); // necessary for attach the canvas where you want into the DOM
    }

    sketch.draw = function() {
        sketch.background(200);

        sketch.ambientLight(150);
        sketch.ambientMaterial(250);
        sketch.directionalLight(250, 250, 250, sketch.width, sketch.height, 0.25);

        sketch.scale(2,2);
        //rotateX(frameCount * 0.01);
        sketch.rotateX(sketch.mouseX * 0.01);
        //rotateY(frameCount * 0.01);
        sketch.rotateY(sketch.mouseY * 0.01);
        sketch.model(obj3d[cur_obj]);

    }

    sketch.keyPressed = function() {
        let xKey = String(sketch.key).toLowerCase();
        if (xKey == 'a') {
            cur_obj = 0;
        } else {
            if (xKey == 'b') {
                cur_obj = 1;
            } else {
                if (xKey == 'c') {
                    cur_obj = 2;
               }
            }
        }
    }

};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    var myp5 = new p5(s);

});
