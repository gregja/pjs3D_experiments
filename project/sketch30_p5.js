var s = function( sketch ) {
    "use strict";

    // Source : https://codepen.io/Spongman/pen/rJOoJa

    var renderer;
    var geometry;

    var width = 600;
    var height = width;

    sketch.setup = function() {

      // we need to remember the renderer that is created so
      // we can call some of its internal methods later
      renderer = sketch.createCanvas(width, height, sketch.WEBGL);
      renderer.parent('#glibcanvas'); // necessary for attach the canvas where you want into the DOM


      sketch.noStroke();

      // set up the camera. the geometry is in the x,y plane
      // so the camera is below the z axis lookup up at (0,0,0)
      sketch.camera(0, -width, height/2, 0, 0, 0, 0, -1, 0);

      // create the geometry. this is really just a copy of
      // the built-in `plane` geometry.
      // there's 10,000 points on the surface.
      geometry = new p5.Geometry(100, 100, function() {
        for (var y = 0; y <= this.detailY; y++) {
          var v = y / this.detailY;
          for (var x = 0; x <= this.detailX; x++) {
            var u = x / this.detailX;
            var p = new p5.Vector(u - 0.5, v - 0.5, 0);
            this.vertices.push(p);
            this.uvs.push(u, v);
          }
        }
      });
    }

    sketch.draw = function() {
      var tt = sketch.millis();

      sketch.background(0);

      // calculate the sun & moon's positions from spherical angles
      var sunPos = p5.Vector.fromAngles(tt / 5000, sketch.PI / 4, 1000);
      var moonPos = p5.Vector.fromAngles(sketch.PI + tt / 5000, sketch.PI / 4, 1000);

      // add spheres where the lights are going to be
      sketch.push();
      sketch.fill(255, 250, 136);
      sketch.translate(sunPos);
      sketch.sphere(60);
      sketch.pop();

      sketch.push();
      sketch.translate(moonPos);
      sketch.fill(255);
      sketch.sphere(40);
      sketch.pop();

      // loop through the geometry's points
      // setting the z coordinate based on some perlin noise
      for (var y = 0; y <= geometry.detailY; y++) {
        for (var x = 0; x <= geometry.detailX; x++) {
          var v = sketch.noise(
            4 * x / geometry.detailX,
            4 * y / geometry.detailY,
            tt / 10000
          );
          // just some simple cropping to simulate 'lakes'
          v = sketch.map(v, 0, 1, -0.5, 1);
          if (v < 0) v = 0;
          // squaring the value makes the peaks more pointy
          // and the valleys smoother
          v = v * v;
          // set the vertex's z coordinate
          geometry.vertices[y * (geometry.detailX + 1) + x].z = v;
        }
      }

      sketch.fill(255);

      // add the sun & moon lights
      sketch.pointLight(255, 250, 136, sunPos);
      sketch.pointLight(150, 150, 150, moonPos);

      // re-compute the faces & normals
      geometry.computeFaces().computeNormals();

      // update the webgl buffers
      renderer.createBuffers("!", geometry);

      // render the geometry
      renderer.drawBuffersScaled("!", 1000, 1000, 500);
    }

};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    var myp5 = new p5(s);

});
