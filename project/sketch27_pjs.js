var pjs = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

    // Cube to sphere program. Inspired by Golan Levin’s circle morphing:
    // https://github.com/golanlevin/circle-morphing, brought to us by
    // Dan Shiffman’s The Coding Train.
    const options = {
        cubeEdgeLength:         30,
        betweenCubeSpace:       75,
        morphPeriodSecs:        10,
        yRotationPeriodSecs:    11
    };

    let numCubes;
    let startCoord;
    let halfSpace;
    let mid_width = 400;
    let mid_height = mid_width;

    pjs.setup = function() {
        pjs.size(mid_width*2, mid_height*2, pjs.P3D);
        pjs.frameRate(10);

        const maxLargeCubeEdge = pjs.min(800, pjs.width, pjs.height);
        numCubes = Math.floor(maxLargeCubeEdge / (options.cubeEdgeLength + options.betweenCubeSpace));
        const spaceNeeded = numCubes * options.cubeEdgeLength + (numCubes - 1) * options.betweenCubeSpace;
        halfSpace = spaceNeeded / 2;
        startCoord = -halfSpace + options.cubeEdgeLength / 2;

        pjs.loop();

    };

    pjs.draw = function() {

        function colorPart(offset) {
            return pjs.map(offset, -halfSpace, halfSpace, 0, 255)
        }

        function forRange(fn) {
            for (let i = 0; i < numCubes; ++i) {
                fn(startCoord + i * (options.cubeEdgeLength + options.betweenCubeSpace));
            }
        }

        pjs.background(64);

        pjs.pushMatrix();
        pjs.translate(mid_width, mid_height); // translate to the middle of the canvas is mandatory with ProcessingJS

        pjs.translate(0, 0, -700);
        pjs.rotateX(pjs.PI / 4);
        pjs.rotateY(pjs.millis() / 1000 / options.yRotationPeriodSecs * pjs.TWO_PI);
        const cornerVector = new pjs.PVector(halfSpace, halfSpace, halfSpace);
        const cosSquashAt = 0.7;
        const radians = pjs.millis() / 1000 / options.morphPeriodSecs * pjs.TWO_PI;
        const cosOverTime = pjs.constrain(pjs.cos(radians), -cosSquashAt, cosSquashAt);
        const changingMaxRadius = new pjs.PVector(
            pjs.map(cosOverTime, -cosSquashAt, cosSquashAt, halfSpace, cornerVector.mag()), 0, 0);

        forRange(x => forRange(y => forRange(z => {
            let pos = new pjs.PVector(x, y, z);
            const shrinkNeeded = changingMaxRadius.mag() / pos.mag();
            if (shrinkNeeded < 1) {
                pos = pos.mult(shrinkNeeded);
            }
            if (pos == undefined) {
                return false;
            }
            pjs.pushMatrix();
            pjs.translate(pos.x, pos.y, pos.z);
            pjs.fill(colorPart(x), colorPart(y), colorPart(z));
            pjs.box(options.cubeEdgeLength);
            pjs.popMatrix();
            return false;
        })));

        pjs.popMatrix();
    };

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
