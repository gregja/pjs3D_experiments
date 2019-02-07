var s = function( sketch ) {
    "use strict";

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

    sketch.setup = function() {
        let c = sketch.createCanvas(mid_width*2, mid_height*2, sketch.WEBGL);
        c.parent('#glibcanvas'); // necessary for attach the canvas where you want into the DOM
        const maxLargeCubeEdge = sketch.min(800, sketch.width, sketch.height);
        numCubes = Math.floor(maxLargeCubeEdge / (options.cubeEdgeLength + options.betweenCubeSpace));
        const spaceNeeded = numCubes * options.cubeEdgeLength + (numCubes - 1) * options.betweenCubeSpace;
        halfSpace = spaceNeeded / 2;
        startCoord = -halfSpace + options.cubeEdgeLength / 2;
    };

    sketch.draw = function() {

        function colorPart(offset) {
            return sketch.map(offset, -halfSpace, halfSpace, 0, 255)
        }

        function forRange(fn) {
            for (let i = 0; i < numCubes; ++i) {
                fn(startCoord + i * (options.cubeEdgeLength + options.betweenCubeSpace));
            }
        }

        sketch.background(64);
        sketch.translate(0, 0, -700);
        sketch.rotateX(sketch.PI / 4);
        sketch.rotateY(sketch.millis() / 1000 / options.yRotationPeriodSecs * sketch.TWO_PI);
        const cornerVector = sketch.createVector(halfSpace, halfSpace, halfSpace);
        const cosSquashAt = 0.7;
        const radians = sketch.millis() / 1000 / options.morphPeriodSecs * sketch.TWO_PI;
        const cosOverTime = sketch.constrain(sketch.cos(radians), -cosSquashAt, cosSquashAt);
        const changingMaxRadius = sketch.createVector(
            sketch.map(cosOverTime, -cosSquashAt, cosSquashAt, halfSpace, cornerVector.mag()), 0, 0);

        forRange(x => forRange(y => forRange(z => {
            let pos = sketch.createVector(x, y, z);
            const shrinkNeeded = changingMaxRadius.mag() / pos.mag();
            if (shrinkNeeded < 1) {
                pos = pos.mult(shrinkNeeded);
            }
            sketch.push();
            sketch.translate(pos.x, pos.y, pos.z);
            sketch.fill(colorPart(x), colorPart(y), colorPart(z));
            sketch.box(options.cubeEdgeLength);
            sketch.pop();
        })))
    };

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
