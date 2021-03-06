var s = function( sketch ) {
    "use strict";

    // p5.disableFriendlyErrors = true;

    var angle_rotation_y = 0.0;
    var sphere;
    var max_width = 800;
    var max_height = 600;
    var width_by_2 = max_width/2
    var height_by_2 = max_height/2;

    // render mode POINTS ok
    // no visual difference for render modes : LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP
    // render modes not implemented on P5/WebGL : QUAD_STRIP, QUADS
    var render_modes = {triangle_strip:sketch.TRIANGLE_STRIP,
      lines:sketch.LINES, points: sketch.POINTS, triangle_fan:sketch.TRIANGLE_FAN,
      triangles: sketch.TRIANGLES,
    };

    var render_default = Object.keys(render_modes)[0];

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
        sketch.noLoop();
        angle_rotation_y = 0.0;
        sphere.regenerate( radius, step);
    //    sphere.calculus();
        sketch.redraw();
        sketch.loop();
      }
      return null;
    }

    // list of filters to generate as field forms
    var filters = [];   // count , radius , twist, hcount, phase, hradius
    filters.push({field:"render_mode", min:0, max:4, value:0, step:1, label:"Mode", callback:render_callback, init:render_default});

// not working fine : temporarily hidden
//    filters.push({field:"steps", min:1, max:100, value:step, step:1, label:"Step (bug!)", callback:step_callback});

    // store live parameters (attached to filters)
    var data_form = {};

    // generate form fields
    multiSliders('form', filters, data_form);

    sketch.setup = function() {
        let c = sketch.createCanvas(max_width, max_height, sketch.WEBGL);
        c.parent('#glibcanvas'); // necessary to attach the canvas where you want into the DOM
        sketch.frameRate(25);
        sphere = new Sphere( radius, step, sketch);
        sphere.calculus();
    }

    sketch.draw = function() {
        sketch.background( 255 );
        sketch.push();

        sketch.directionalLight(128,128,128,0,0,-1);

        sketch.push();
        sketch.rotateX( sketch.radians(-30));
        sketch.rotateY( angle_rotation_y );
        angle_rotation_y += 0.01;

        sketch.fill( 255, 0, 0 );
        sketch.beginShape(render_modes[render_default]);

        sphere.render();

        sketch.endShape();

        sketch.pop();
        sketch.pop();
    }

    sketch.keyPressed = function(){
      let touchkey = String(sketch.key).toLowerCase();
      if (touchkey == 'x') {
        console.warn('Stopped the loop');
        sketch.noLoop();
      }
    }

};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    var myp5 = new p5(s);
});
