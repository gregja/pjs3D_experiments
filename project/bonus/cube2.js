/* http://jsfiddle.net/jw66Lmhf/9/ */

var sketch = function( dom_canvas ) {
    "use strict";

    // modélisation de cube à la manière de Phoria.js => http://www.kevs3d.co.uk/dev/phoria/
    var generateCube = function generateCube(scale) {
        var s = scale || 1;
        return {
            points: [{
                x: -1 * s,
                y: 1 * s,
                z: -1 * s
            }, {
                x: 1 * s,
                y: 1 * s,
                z: -1 * s
            }, {
                x: 1 * s,
                y: -1 * s,
                z: -1 * s
            }, {
                x: -1 * s,
                y: -1 * s,
                z: -1 * s
            }, {
                x: -1 * s,
                y: 1 * s,
                z: 1 * s
            }, {
                x: 1 * s,
                y: 1 * s,
                z: 1 * s
            }, {
                x: 1 * s,
                y: -1 * s,
                z: 1 * s
            }, {
                x: -1 * s,
                y: -1 * s,
                z: 1 * s
            }],
            edges: [{
                a: 0,
                b: 1
            }, {
                a: 1,
                b: 2
            }, {
                a: 2,
                b: 3
            }, {
                a: 3,
                b: 0
            }, {
                a: 4,
                b: 5
            }, {
                a: 5,
                b: 6
            }, {
                a: 6,
                b: 7
            }, {
                a: 7,
                b: 4
            }, {
                a: 0,
                b: 4
            }, {
                a: 1,
                b: 5
            }, {
                a: 2,
                b: 6
            }, {
                a: 3,
                b: 7
            }],
            polygons: [
                [0, 1, 2, 3],
                [1, 5, 6, 2],
                [5, 4, 7, 6],
                [4, 0, 3, 7],
                [4, 5, 1, 0],
                [3, 2, 6, 7]
            ]
        }
    };

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

    var cube = new generateCube(100);

    pjs.setup = function () {
        pjs.size(400, 400, pjs.OPENGL);
        pjs.frameRate(30);
        pjs.strokeWeight(10, 10, 10, 10);
        pjs.loop();
    };

    pjs.draw = function () {
        pjs.background(255, 255, 150);
        pjs.lights();
        pjs.ambientLight(128,128,128);
        pjs.beginShape(pjs.QUADS);

        /*
        cube.polygons.map(vertices => {
            let points = [];
            points.push({point:cube.points[vertices[0]], u:0, v:0});
            points.push({point:cube.points[vertices[1]], u:1, v:0});
            points.push({point:cube.points[vertices[2]], u:1, v:1});
            points.push({point:cube.points[vertices[3]], u:0, v:1});

            points.map(item => {
                pjs.vertex(item.point.x, item.point.y, item.point.z, item.u, item.v);
            })
        });
        */
        // variante du bloc précédent (en commentaire)
        cube.polygons.map(vertices => {
            let point ;
            point = cube.points[vertices[0]];
            pjs.vertex(point.x, point.y, point.z, 0, 0);

            point = cube.points[vertices[1]];
            pjs.vertex(point.x, point.y, point.z, 1, 0);

            point = cube.points[vertices[2]];
            pjs.vertex(point.x, point.y, point.z, 1, 1);

            point = cube.points[vertices[3]];
            pjs.vertex(point.x, point.y, point.z, 0, 1);

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
    
