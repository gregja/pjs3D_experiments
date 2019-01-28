// M_1_4_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * creates a terrain like mesh based on noise values.
 *
 * MOUSE
 * position x/y + left drag   : specify noise input range
 * position x/y + right drag  : camera controls
 *
 * KEYS
 * arrow up                   : noise falloff +
 * arrow down                 : noise falloff -
 * arrow left                 : noise octaves -
 * arrow right                : noise octaves +
 * space                      : new noise seed
 * +                          : zoom in
 * -                          : zoom out
 * s                          : save png
 */

 var s = function( sketch ) {
     "use strict";

    // ------ mesh ------
    var tileCount;
    var zScale;

    // ------ noise ------
    var noiseXRange;
    var noiseYRange;
    var octaves;
    var falloff;

    // ------ mesh coloring ------
    var midColor;
    var topColor;
    var bottomColor;
    var strokeColor;
    var threshold;

    // ------ mouse interaction ------
    var offsetX;
    var offsetY;
    var clickX;
    var clickY;
    var zoom;
    var rotationX;
    var rotationZ;
    var targetRotationX;
    var targetRotationZ;
    var clickRotationX;
    var clickRotationZ;

    var mid_width = 300;
    var mid_height = mid_width;

    var c; // pointer to the canvas

    sketch.setup = function() {
        c = sketch.createCanvas(mid_width * 2, mid_height * 2, sketch.WEBGL);
        sketch.colorMode(sketch.HSB, 360, 100, 100);
        sketch.cursor(sketch.CROSS);

        c.parent('#glibcanvas'); // necessary for attach the canvas where you want into the DOM

        // ------ mesh ------
        tileCount = 50;
        zScale = 150;

        // ------ noise ------
        noiseXRange = 10;
        noiseYRange = 10;
        octaves = 4;
        falloff = 0.5;

        // ------ mesh coloring ------
        topColor = sketch.color(0, 0, 100);
        midColor = sketch.color(191, 99, 63);
        bottomColor = sketch.color(0, 0, 0);
        strokeColor = sketch.color(180, 100, 100);
        threshold = 0.30;

        // ------ mouse interaction ------
        offsetX = 0;
        offsetY = 0;
        clickX = 0;
        clickY = 0;
        zoom = -300;
        rotationX = 0;
        rotationZ = 0;
        targetRotationX = sketch.PI / 3;
        targetRotationZ = 0;
    }

    sketch.draw = function() {
        sketch.background(0, 0, 100);
        sketch.ambientLight(150);

        // ------ set view ------
        sketch.push();
        sketch.translate(sketch.width * 0.05, sketch.height * 0.05, zoom);

        if (sketch.mouseIsPressed && sketch.mouseButton == sketch.RIGHT) {
            offsetX = sketch.mouseX - clickX;
            offsetY = sketch.mouseY - clickY;
            targetRotationX = sketch.min(sketch.max(clickRotationX + offsetY / sketch.float(sketch.width) * sketch.TWO_PI, -sketch.HALF_PI), sketch.HALF_PI);
            targetRotationZ = clickRotationZ + offsetX / sketch.float(sketch.height) * sketch.TWO_PI;
        }
        rotationX += (targetRotationX - rotationX) * 0.25;
        rotationZ += (targetRotationZ - rotationZ) * 0.25;
        sketch.rotateX(-rotationX);
        sketch.rotateZ(-rotationZ);

        // ------ mesh noise ------
        if (sketch.mouseIsPressed && sketch.mouseButton == sketch.LEFT) {
            noiseXRange = sketch.mouseX / 10;
            noiseYRange = sketch.mouseY / 10;
        }

        sketch.noiseDetail(octaves, falloff);
        var noiseYMax = 0;

        var tileSizeY = sketch.height / tileCount;
        var noiseStepY = noiseYRange / tileCount;

        for (let meshY = 0; meshY <= tileCount; meshY++) {
            sketch.beginShape(sketch.TRIANGLE_STRIP);
            for (let meshX = 0; meshX <= tileCount; meshX++) {

                let x = sketch.map(meshX, 0, tileCount, -mid_width, mid_width);
                let y = sketch.map(meshY, 0, tileCount, -mid_height, mid_height);

                let noiseX = sketch.map(meshX, 0, tileCount, 0, noiseXRange);
                let noiseY = sketch.map(meshY, 0, tileCount, 0, noiseYRange);
                let z1 = sketch.noise(noiseX, noiseY);
                let z2 = sketch.noise(noiseX, noiseY + noiseStepY);

                noiseYMax = sketch.max(noiseYMax, z1);
                let interColor;
                sketch.colorMode(sketch.RGB);
                let amount;
                if (z1 <= threshold) {
                    amount = sketch.map(z1, 0, threshold, 0.15, 1);
                    interColor = sketch.lerpColor(bottomColor, midColor, amount);
                } else {
                    amount = sketch.map(z1, threshold, noiseYMax, 0, 1);
                    interColor = sketch.lerpColor(midColor, topColor, amount);
                }
                sketch.fill(interColor);
                sketch.stroke(strokeColor);
                sketch.strokeWeight(1);
                sketch.vertex(x, y, z1 * zScale);
                sketch.vertex(x, y + tileSizeY, z2 * zScale);
            }
            sketch.endShape();
        }
        sketch.pop();

    }

    sketch.mousePressed = function() {
      clickX = sketch.mouseX;
      clickY = sketch.mouseY;
      clickRotationX = rotationX;
      clickRotationZ = rotationZ;
    }

    sketch.keyReleased = function() {
        let keyCode = sketch.keyCode;
        let key = sketch.key;
        if (keyCode == sketch.UP_ARROW) falloff += 0.05;
        if (keyCode == sketch.DOWN_ARROW) falloff -= 0.05;
        if (falloff > 1.0) falloff = 1.0;
        if (falloff < 0.0) falloff = 0.0;

        if (keyCode == sketch.LEFT_ARROW) octaves--;
        if (keyCode == sketch.RIGHT_ARROW) octaves++;
        if (octaves < 0) octaves = 0;

        if (keyCode == 187) zoom += 20; // '+'
        if (keyCode == 189) zoom -= 20; // '-'

        if (key == 's' || key == 'S') sketch.saveCanvas(c, 'mycanvas', 'png');
        if (key == ' ') sketch.noiseSeed(sketch.floor(sketch.random(100000)));
    }

};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    var myp5 = new p5(s);
});
