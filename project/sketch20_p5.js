var s = function( sketch ) {
    "use strict";

    /*
         * Sketch inspired by this D3 sketch :
         * https://bl.ocks.org/mbostock/3231307
         *
         * The D3 sketch is combined with P5.js and it's really cool
         * The "A" key changes the balls rendering (3 different modes)
         *  - first rendering drawed by P5
         *  - second rendering drawed directly by Canvas for gradient colors
         *  - third rendering similar to second, plus a shadow effect
         * The "L" key adds vertexes drawed by P5
         */

    var maxwidth = 960;
    var maxheight = 500;

    var nodes = d3.range(200).map(function() { return {radius: Math.random() * 12 + 4}; });
    var root = nodes[0];
    root.radius = 0;
    root.fixed = true;
    var q, n;
    var data = [];
    var ellipse_type = 1;
    var vertexActive = false;

    var drawingContext;

    var force = d3.layout.force()
    .gravity(0.05)
    .charge(function(d, i) { return i ? 0 : -2000; })
    .nodes(nodes)
    .size([maxwidth, maxheight]);

    force.start();

    // améliore les perfs :
    //  https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#use-native-js-in-bottlenecks
    p5.disableFriendlyErrors = true;

    sketch.setup = function() {
      let c = sketch.createCanvas(maxwidth, maxheight);
      c.parent('#glibcanvas'); // necessary for attach the canvas where you want into the DOM

      force.on("tick", function(e) {
        q = d3.geom.quadtree(nodes);
        n = nodes.length;
      });

      drawingContext = sketch.drawingContext;
    }

    sketch.draw = function() {
      var i, d, grd;

      for (i = 1; i < n; ++i) {
        q.visit(collide(nodes[i]));
      }

      sketch.background(255);
      if (ellipse_type == 1) {
        sketch.stroke("steelblue");
        sketch.fill("rgba(192,192,192, .5)");
      } else {
        drawingContext.save();
        if (ellipse_type == 3) {
          drawingContext.shadowOffsetX = 2;
          drawingContext.shadowOffsetY = 5;
          drawingContext.shadowBlur = 10;
          drawingContext.shadowColor = "black";
        } else {
          drawingContext.shadowOffsetX = undefined;
          drawingContext.shadowOffsetY = undefined;
          drawingContext.shadowBlur = undefined;
          drawingContext.shadowColor = undefined;
        }
      }

      if (vertexActive) {
        sketch.beginShape();
      }

      for (i = 1; i < n; ++i) {
        d = nodes[i];

        if (ellipse_type == 1) {
          // Tracé des cercles réalisé par P5
          sketch.rect(d.x, d.y, d.radius, d.radius);
        } else {
          // Tracé des cercles réalisé par Canvas avec effet de dégradé
          grd = drawingContext.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
          grd.addColorStop(0,"red");
          grd.addColorStop(1,"white");
          drawingContext.fillStyle = grd;
          // Tracé des cercles réalisé par Canvas avec effet d'ombre
          drawingContext.beginPath();
          drawingContext.arc(d.x, d.y, d.radius, 0, sketch.TWO_PI, true);
          drawingContext.closePath();
          drawingContext.fill();
        }
        if (vertexActive) {
          sketch.vertex(d.x, d.y);
        }
      }
      if (vertexActive) {
        sketch.endShape(sketch.CLOSE);
      }
      if (ellipse_type != 1) {
        drawingContext.restore();
      }
    }

    sketch.mouseMoved = function() {
      root.px = sketch.mouseX;
      root.py = sketch.mouseY;
      force.resume();
    }

    sketch.touchMoved = function() {
      root.px = sketch.mouseX;
      root.py = sketch.mouseY;
      force.resume();
    }

    sketch.keyTyped = function() {
      let key = String(sketch.key).toLowerCase();
      if (key == 'a') {
        ellipse_type++ ;
        if (ellipse_type > 3) {
          ellipse_type = 1;
        }
      }
      if (key == 'l') {
        vertexActive = !vertexActive;
      }
      return false;
    }

    function collide(node) {
      var r = node.radius + 16,
          nx1 = node.x - r,
          nx2 = node.x + r,
          ny1 = node.y - r,
          ny2 = node.y + r;
      return function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
          var x = node.x - quad.point.x,
              y = node.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = node.radius + quad.point.radius;
          if (l < r) {
            l = (l - r) / l * .5;
            node.x -= x *= l;
            node.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      };
    }
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    var myp5 = new p5(s);
});
