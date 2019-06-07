
var sketch = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    if (!canvas) {
        console.warn('Canvas tag not found in the DOM, failed to start ProcessingJS');
        return;
    }

    var list_shapes = ['cube', 'diamond', 'gem', 'icosahedron', 'icosphere', 'lamp', 'shuttle',
                        'teapot', 'tetrahedron', 'toroid', 'torusknot', 'twistedtorus'];

    var pjs = new Processing(canvas);

    var frontToBack = true;
    var shift = 0;
    var color = "#affaff";
    var colpicker = document.getElementById("colorpicker");
    if (colpicker) {
        colpicker.value = color;
        colpicker.addEventListener('change', function(evt){
            color = this.value;
        }, false);
    } else {
        console.warn('color picker not found');
    }

    var shape3d = shapes3dToolbox.import3dObj({
        url: "./assets/"+list_shapes[0]+".obj.txt",
        scaleTo: 300,
        reorder: false,
        center: true
    });

    var objselector = document.getElementById("objselector");
    if (objselector) {
        list_shapes.forEach(item => {
            let option = document.createElement('option');
            option.setAttribute('value', item);
            option.innerHTML = item;
            objselector.append(option);
        });
        objselector.value = list_shapes[0];
        objselector.addEventListener('change', function(evt) {
            shape3d = shapes3dToolbox.import3dObj({
                url: "./assets/"+this.value+".obj.txt",
                scaleTo: 300,
                reorder: false,
                center: true
            });

        }, false);
    } else {
        console.warn('obj selector not found');
    }

    pjs.setup = function () {
        pjs.size(400, 400, pjs.OPENGL);
        pjs.frameRate(30);
        pjs.strokeWeight(1, 1, 1, 1);
        pjs.loop();
    };

    pjs.draw = function () {
        pjs.background(255, 255, 150);

        pjs.beginShape(pjs.TRIANGLES);   // POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, and QUAD_STRIP

        pjs.lights();
        pjs.ambientLight(128,128,128);


        shape3d.polygons.forEach(vertices => {
            let points = [];

            vertices.map(vertix => {
                points.push({point:shape3d.points[vertix], u:1, v:1});
            })

            points.forEach(item => {
                pjs.vertex(item.point.x, item.point.y, item.point.z, item.u, item.v);
            })
        });

        pjs.translate(200, 200, -shift*100);

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
