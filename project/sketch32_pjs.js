var sketch = function( dom_canvas ) {
  "use strict";

  var canvas = document.getElementById(dom_canvas);
  var pjs = new Processing(canvas);

  var mid_width = 300;
  var mid_height = mid_width;
  var widthCanvas = mid_width * 2;
  var heightCanvas = mid_height * 2;
  var nodes = [], edges = [];
  var nodeSize = 1;
  var myCanvas;
  var radius = 200;
  var mode_lat = "1";
  var mode_long = true;

  function createNodesEdges(_radius, _mode_lat="1", _mode_long=true) {
      var yIncr = 5;
      var angleIncr = 0.3;
      var r = _radius;
      var mode_lat = _mode_lat;
      var mode_long = _mode_long;

      var xCenter = 0;
      var yCenter = 0;
      var zCenter = 0;

      const TWO_PI = Math.PI * 2;

      var j = 0;
      var nLo = 0; // number of lines of longitude
      var nLa = 0; // number of lines of latitude
      var p;

      if (mode_lat == '1' || mode_lat == '2' ) {
          // create nodes and lines of latitude of half sphere
          for ( let y1 = r; y1 >= 0; y1 -= yIncr ) {
              let r_this = Math.sqrt(Math.pow(r,2) - Math.pow(y1,2));
              let i = 0;
                  for ( let angle = 0; angle < 2 * Math.PI; angle += angleIncr ) {
                      let x = Math.cos(angle) * r_this + xCenter;
                      let z = Math.sin(angle) * r_this + zCenter;
                      let y = y1 + yCenter;
                      nodes[j] = [x,y,z];
                      if (i==0) {
                          p = j;
                      } else {
                          edges[j] = [j,j-1];
                      }
                      i++;
                      j++;
                  }
              nLo = i; //number of lines of longitude
              nLa++;   //number of lines of latitude
              edges[p] = [j-1,p];
          }
      }

      if (mode_lat == '1' || mode_lat == '3' ) {
          // create nodes and lines of latitude of other half sphere
          for ( let y1 = -yIncr; y1 >= -r; y1 -= yIncr ) {
              let r_this = Math.sqrt(Math.pow(r,2) - Math.pow(y1,2));
              let i = true;
              for ( let angle = 0; angle < TWO_PI ; angle += angleIncr ) {
                  let x = Math.cos(angle) * r_this + xCenter;
                  let z = Math.sin(angle) * r_this + zCenter;
                  let y = y1 + yCenter;
                  nodes[j] = [x,y,z];
                  if (i==true) {
                      p = j;
                  } else {
                      edges[j] = [j,j-1];
                  }
                  i = false;
                  j++;
              }
              nLa++;   //number of lines of latitude
              edges[p] = [j-1,p];
          }
      }

      if (mode_long) {
          // create lines of longitude
          var t = 0;
          for (let s=0; s < nLo; s++) {
              t = s;
              for (let q=0; q < nLa-1; q++) {
                  let tn = t;
                  t += nLo;
                  edges[j] = [t,tn];
                  j++;
              }
          }
      }


      //rotateZ3D(20 * Math.PI / 180);
      rotateX3D(40 * Math.PI / 180);
      rotateY3D(30 * Math.PI / 180);
  };

  // Rotate shape around the z-axis
  function rotateZ3D(theta) {
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (let n=0, nmax=nodes.length; n<nmax; n++) {
          let node = nodes[n];
          let x = node[0];
          let y = node[1];
          node[0] = x * cosTheta - y * sinTheta;
          node[1] = y * cosTheta + x * sinTheta;
      }
  };

  // Rotate shape around the y-axis
  function rotateY3D(theta) {
      var sinTheta = Math.sin(-theta);
      var cosTheta = Math.cos(-theta);

      for (let n=0, nmax=nodes.length; n<nmax; n++) {
          let node = nodes[n];
          let x = node[0];
          let z = node[2];
          node[0] = x * cosTheta - z * sinTheta;
          node[2] = z * cosTheta + x * sinTheta;
      }
  };

  // Rotate shape around the x-axis
  function rotateX3D(theta) {
      var sinTheta = Math.sin(-theta);
      var cosTheta = Math.cos(-theta);

      for (let n=0, nmax=nodes.length; n<nmax; n++) {
          let node = nodes[n];
          let y = node[1];
          let z = node[2];
          node[1] = y * cosTheta - z * sinTheta;
          node[2] = z * cosTheta + y * sinTheta;
      }
  };

  createNodesEdges(radius, mode_lat, mode_long);

  pjs.setup = function() {
    pjs.size(widthCanvas, heightCanvas);
    //pjs.frameRate(60);

    pjs.background( 255 );

    pjs.loop();
  }

  pjs.draw = function() { // By default, p5.js loops through draw() continuously at 60 frames per second.

      var backgroundColour = pjs.color(255, 255, 255);
      var nodeColour = pjs.color(40, 168, 107);
      var edgeColour = pjs.color(34, 68, 204);
      //var faceColour = pjs.color(255, 0, 0);

      pjs.background(backgroundColour); // overdraws the previous orientations at the loop rate
      pjs.translate(mid_width, mid_height); // shift the canvas widthCanvas/2 px right and heightCanvas/2 px down, so position (0,0) is at the center of the canvas

      // Draw edges
      pjs.stroke(edgeColour);
      for (let e=0, emax=edges.length; e < emax; e++) {
          let n0 = edges[e][0];
          let n1 = edges[e][1];
          let node0 = nodes[n0];
          let node1 = nodes[n1];
          pjs.line(node0[0], node0[1], node1[0], node1[1]);
      }

      if (nodeSize > 1) {
          // Draw nodes
          pjs.fill(nodeColour);
          pjs.noStroke();
          for (var n=0, nmax=nodes.length; n < nmax; n++) {
              var node = nodes[n];
              pjs.ellipse(node[0], node[1], nodeSize, nodeSize);
          }
      }

  };

  pjs.mouseDragged = function() {
      rotateY3D((pjs.mouseX - pjs.pmouseX) * Math.PI / 180);
      rotateX3D((pjs.mouseY - pjs.pmouseY) * Math.PI / 180);
      //myCanvas.style.cursor = "grabbing";
  };

  pjs.touchMoved = function() {
      rotateY3D((pjs.mouseX - pjs.pmouseX) * Math.PI / 180);
      rotateX3D((pjs.mouseY - pjs.pmouseY) * Math.PI / 180);
      // prevent default
      return false;
  };

  pjs.keyPressed = function() {
      let key = String(pjs.key).toLowerCase();
      if (key == '+' || key == '-') {
          if (key == '+') {
              nodeSize++;
              if (nodeSize > 20) {
                  nodeSize = 20;
              }
          } else {
              nodeSize--;
              if (nodeSize < 1) {
                  nodeSize = 1;
              }
          }
      }
      if (key == '1' || key == '2' || key == '3') {
          mode_lat = key;
          nodes = [], edges = [];
          createNodesEdges(radius, mode_lat, mode_long);
      }
      if (key == 'l') {
          mode_long = !mode_long;
          nodes = [], edges = [];
          createNodesEdges(radius, mode_lat, mode_long);
      }
      if (key == 'x') {
          console.warn('Stop the loop');
          pjs.noLoop();
      }
      if (key == 'r') {
          console.warn('Restart the loop');
          pjs.loop();
      }
  };

  // kickstart the sketch
  pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});
