var s = function( sketch ) {
    "use strict";

    // http://p5js.org/reference/#/p5/createShader

    // the 'varying's are shared between both vertex & fragment shaders
    let varying = 'precision highp float; varying vec2 vPos;';

    // the vertex shader is called for each vertex
    let vs =
      varying +
      'attribute vec3 aPosition;' +
      'void main() { vPos = (gl_Position = vec4(aPosition,1.0)).xy; }';

    // the fragment shader is called for each pixel
    let fs =
      varying +
      'uniform vec2 p;' +
      'uniform float r;' +
      'const int I = 500;' +
      'void main() {' +
      '  vec2 c = p + vPos * r, z = c;' +
      '  float n = 0.0;' +
      '  for (int i = I; i > 0; i --) {' +
      '    if(z.x*z.x+z.y*z.y > 4.0) {' +
      '      n = float(i)/float(I);' +
      '      break;' +
      '    }' +
      '    z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;' +
      '  }' +
      '  gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);' +
      '}';

    let mandel;

    var width = 400;
    var height = width;

    sketch.setup = function() {

      // we need to remember the renderer that is created so
      // we can call some of its internal methods later
      let renderer = sketch.createCanvas(width, height, sketch.WEBGL);
      renderer.parent('#glibcanvas'); // necessary for attach the canvas where you want into the DOM

      // create and initialize the shader
      mandel = sketch.createShader(vs, fs);

      sketch.shader(mandel);
      sketch.noStroke();

      // 'p' is the center point of the Mandelbrot image
      mandel.setUniform('p', [-0.74364388703, 0.13182590421])
    }

    sketch.draw = function() {

        // 'r' is the size of the image in Mandelbrot-space
        mandel.setUniform('r', 1.5 * sketch.exp(-6.5 * (1 + sketch.sin(sketch.millis() / 2000))));
        sketch.quad(-1, -1, 1, -1, 1, 1, -1, 1);

    }

};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    var myp5 = new p5(s);
});
