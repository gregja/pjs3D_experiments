var sketch = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

    var angle_rotation_y = 0.0;
    var sphere;
    var max_width = 800;
    var max_height = 600;
    var width_by_2 = max_width/2
    var height_by_2 = max_height/2;

    // render modes : POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, and QUAD_STRIP
    var render_modes = {quad: pjs.QUAD_STRIP, triangle:pjs.TRIANGLE_STRIP,
      lines:pjs.LINES, points: pjs.POINTS, triangle_fan:pjs.TRIANGLE_FAN,
      triangles: pjs.TRIANGLES, quads: pjs.QUADS
    };
    var render_default = Object.keys(render_modes)[0]; // => quad

    var radius = 150;
    var step = 20;

    var render_callback = function (self) {
      let keys = Object.keys(render_modes);
      data_form[self.id] = keys[self.value];
      render_default = keys[self.value];
      return keys[self.value];
    }

    var step_callback = function (self) {
      data_form[self.id] = self.value;
      if (step != self.value) {
        console.log('recalcul '+ self.value );
        step = self.value;
        pjs.noLoop();
        angle_rotation_y = 0.0;
        sphere.regenerate( radius, step);
    //    sphere.calculus();
    pjs.redraw();
        pjs.loop();
      }
      return null;
    }

    // list of filters to generate as field forms
    var filters = [];   // count , radius , twist, hcount, phase, hradius
    filters.push({field:"render_mode", min:0, max:6, value:0, step:1, label:"Mode", callback:render_callback, init:render_default});

// not working fine : temporarily hidden
// filters.push({field:"steps", min:1, max:100, value:step, step:1, label:"Step (bug!)", callback:step_callback});

    // store live parameters (attached to filters)
    var data_form = {};

    // generate form fields
    multiSliders('form', filters, data_form);

    pjs.setup = function() {
        pjs.size(max_width, max_height, pjs.P3D);
        pjs.frameRate(25);
        sphere = new Sphere( radius, step, pjs);
        sphere.calculus();
    }

    pjs.draw = function() {
        pjs.background( 255 );
        pjs.pushMatrix();

        pjs.translate( width_by_2, height_by_2 );
        pjs.lights();
        pjs.ambientLight(128,128,128);

        pjs.pushMatrix();
        pjs.rotateX( pjs.radians(-30));
        pjs.rotateY( angle_rotation_y );
        angle_rotation_y += 0.01;

        pjs.fill( 255, 0, 0 );
        pjs.beginShape(render_modes[render_default]);

        sphere.render();

        pjs.endShape();

        pjs.popMatrix();
        pjs.popMatrix();
    }

    pjs.keyPressed = function(){
      let touchkey = String(pjs.key).toLowerCase();
      if (touchkey == 'x') {
        console.warn('Stopped the loop');
        pjs.noLoop();
      }
    }

    // kickstart the sketch
    pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});
