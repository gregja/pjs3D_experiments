var sketch = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

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

    pjs.setup = function() {
      pjs.size(maxwidth, maxheight);

      force.on("tick", function(e) {
        q = d3.geom.quadtree(nodes);
        n = nodes.length;
      });

      drawingContext = pjs.externals.context;

      pjs.loop();
    }

    pjs.draw = function() {
      var i, d, grd;

      for (i = 1; i < n; ++i) {
        q.visit(collide(nodes[i]));
      }

      pjs.background(255);

              drawingContext.save();

      if (ellipse_type == 1) {
        pjs.stroke("steelblue");
        pjs.fill("grey");
      } else {

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
        pjs.beginShape();
      }

      for (i = 1; i < n; ++i) {
        d = nodes[i];

        if (ellipse_type == 1) {
          // Tracé des cercles réalisé par P5
          pjs.stroke(70,130,180);
          pjs.fill(192,192,192, 50);
          pjs.rect(d.x, d.y, d.radius, d.radius);
        } else {
          // Tracé des cercles réalisé par Canvas avec effet de dégradé
          grd = drawingContext.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
          grd.addColorStop(0,"red");
          grd.addColorStop(1,"white");
          drawingContext.fillStyle = grd;
          // Tracé des cercles réalisé par Canvas avec effet d'ombre
          drawingContext.beginPath();
          drawingContext.arc(d.x, d.y, d.radius, 0, pjs.TWO_PI, true);
          drawingContext.closePath();
          drawingContext.fill();
        }
        if (vertexActive) {
          pjs.vertex(d.x, d.y);
        }
      }
      if (vertexActive) {
        pjs.endShape(pjs.CLOSE);
      }
    //  if (ellipse_type != 1) {
        drawingContext.restore();
    //  }
    }

    pjs.mouseMoved = function() {
      root.px = pjs.mouseX;
      root.py = pjs.mouseY;
      force.resume();
    }

    pjs.touchMoved = function() {
      root.px = pjs.mouseX;
      root.py = pjs.mouseY;
      force.resume();
    }

    pjs.keyTyped = function() {
      let key = String(pjs.key).toLowerCase();
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

    // kickstart the sketch
    pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});
