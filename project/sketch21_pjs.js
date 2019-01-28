var pjs = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

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

   var mid_width = 400;
   var mid_height = mid_width;

   var render_callback = function (self) {
     let keys = Object.keys(render_modes);
     data_form[self.id] = keys[self.value];
     render_default = keys[self.value];
     return keys[self.value];
   }

//   var render_modes = {quad: pjs.QUAD_STRIP, triangle:pjs.TRIANGLE_STRIP};
   // POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, and QUAD_STRIP
   var render_modes = {quad: pjs.QUAD_STRIP, triangle:pjs.TRIANGLE_STRIP,
     lines:pjs.LINES, points: pjs.POINTS, triangle_fan:pjs.TRIANGLE_FAN,
     triangles: pjs.TRIANGLES, quads: pjs.QUADS
   };

   var render_default = Object.keys(render_modes)[0]; // => quad

   // list of filters to generate as field forms
   var filters = [];   // count , radius , twist, hcount, phase, hradius
   filters.push({field:"render_mode", min:0, max:6, value:0, step:1, label:"Mode", callback:render_callback, init:render_default});

   // store live parameters (attached to filters)
   var data_form = {};

   // generate form fields
   multiSliders('form', filters, data_form);
   pjs.setup = function() {
       pjs.size(mid_width * 2, mid_height * 2, pjs.P3D);
       pjs.colorMode(pjs.HSB, 360, 100, 100);
       pjs.cursor(pjs.CROSS);

       // ------ mesh ------
       tileCount = 50;
       zScale = 150;

       // ------ noise ------
       noiseXRange = 10;
       noiseYRange = 10;
       octaves = 4;
       falloff = 0.5;

       // ------ mesh coloring ------
       topColor = pjs.color(0, 0, 100);
       midColor = pjs.color(191, 99, 63);
       bottomColor = pjs.color(0, 0, 0);
       strokeColor = pjs.color(180, 100, 100);
       threshold = 0.30;

       // ------ mouse interaction ------
       offsetX = 0;
       offsetY = 0;
       clickX = 0;
       clickY = 0;
       zoom = -300;
       rotationX = 0;
       rotationZ = 0;
       targetRotationX = pjs.PI / 3;
       targetRotationZ = 0;

       pjs.loop();
   }

   pjs.draw = function() {

       pjs.background( 255, 1 );
       pjs.pushMatrix();

       pjs.translate( mid_width, mid_height, zoom );
       pjs.lights();

       rotationX += (targetRotationX - rotationX) * 0.25;
       rotationZ += (targetRotationZ - rotationZ) * 0.25;
       pjs.rotateX(-rotationX);
       pjs.rotateZ(-rotationZ);

       pjs.pushMatrix();

       pjs.noiseDetail(octaves, falloff);
       var noiseYMax = 0;

       var tileSizeY = pjs.height / tileCount;
       var noiseStepY = noiseYRange / tileCount;

       for (let meshY = 0; meshY <= tileCount; meshY++) {
           //pjs.beginShape(pjs.TRIANGLE_STRIP);
           pjs.beginShape(render_modes[render_default]);

           for (let meshX = 0; meshX <= tileCount; meshX++) {

               let x = pjs.map(meshX, 0, tileCount, -mid_width, mid_width);
               let y = pjs.map(meshY, 0, tileCount, -mid_height, mid_height);

               let noiseX = pjs.map(meshX, 0, tileCount, 0, noiseXRange);
               let noiseY = pjs.map(meshY, 0, tileCount, 0, noiseYRange);
               let z1 = pjs.noise(noiseX, noiseY);
               let z2 = pjs.noise(noiseX, noiseY + noiseStepY);

               noiseYMax = pjs.max(noiseYMax, z1);
               let interColor;
               pjs.colorMode(pjs.RGB);
               let amount;
               if (z1 <= threshold) {
                   amount = pjs.map(z1, 0, threshold, 0.15, 1);
                   interColor = pjs.lerpColor(bottomColor, midColor, amount);
               } else {
                   amount = pjs.map(z1, threshold, noiseYMax, 0, 1);
                   interColor = pjs.lerpColor(midColor, topColor, amount);
               }
               pjs.fill(interColor);
               pjs.stroke(strokeColor);
               pjs.strokeWeight(1);
               pjs.vertex(x, y, z1 * zScale);
               pjs.vertex(x, y + tileSizeY, z2 * zScale);
           }
           pjs.endShape();
       }
       pjs.popMatrix();
       pjs.popMatrix();
    }

    pjs.mouseDragged = function() {
        //------ mesh noise ------
        if (pjs.mouseButton == pjs.LEFT) {
            noiseXRange = pjs.mouseX / 10;
            noiseYRange = pjs.mouseY / 10;
        }

        if (pjs.mouseButton == pjs.RIGHT) {
            offsetX = pjs.mouseX - clickX;
            offsetY = pjs.mouseY - clickY;
            targetRotationX = pjs.min(pjs.max(clickRotationX + offsetY / pjs.width * pjs.TWO_PI, -pjs.HALF_PI), pjs.HALF_PI);
            targetRotationZ = clickRotationZ + offsetX / pjs.height * pjs.TWO_PI;
        }
        clickX = pjs.mouseX;
        clickY = pjs.mouseY;
        clickRotationX = rotationX;
        clickRotationZ = rotationZ;
    }

    pjs.keyPressed = function() {
       let keyCode = pjs.keyCode;
       let key = String(pjs.key).toLowerCase();
       if (keyCode == pjs.UP_ARROW) falloff += 0.05;
       if (keyCode == pjs.DOWN_ARROW) falloff -= 0.05;
       if (falloff > 1.0) falloff = 1.0;
       if (falloff < 0.0) falloff = 0.0;

       if (keyCode == pjs.LEFT_ARROW) octaves--;
       if (keyCode == pjs.RIGHT_ARROW) octaves++;
       if (octaves < 0) octaves = 0;

       if (keyCode == 187) zoom += 20; // '+'
       if (keyCode == 189) zoom -= 20; // '-'

       if (key == 's') {
           pjs.save("diagonal.tif");
       }
       if (key == ' ') pjs.noiseSeed(pjs.floor(pjs.random(100000)));
   }


    // kickstart the pjs
    pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the pjs when the DOM is ready (best practice)");
  pjs('glibcanvas');
});
