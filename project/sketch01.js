var sketch = function( dom_canvas ) {
"use strict";
    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

    // let's write a sketch
    var value = 0;
    var sizeScreen = 400;
    var midScreen = sizeScreen / 2;

    // Definition for the initial entry point
    pjs.setup = function() {
       pjs.size(sizeScreen, sizeScreen);
       // we want to turn off animation, because this is a demo page and it
       // would use cpu while not being looked at. Only draw on mousemoves
       pjs.noLoop();
      /* pjs.background(255);
       pjs.fill(0,150);
       var s = "mouseOver to make things happen";
       pjs.text(s, (200-pjs.textWidth(s))/2, 100);*/
     }
     // Definition of the frame drawing function This will draw a
     // "sine wave" using two bezier curves, with an undulating amplitude.
     pjs.draw = function() {
       //pjs.beginDraw();
       // partially clear, by overlaying a semi-transparent rect
       // with background color
       pjs.noStroke();
       pjs.fill(255, 75);
       pjs.rect(0,0,sizeScreen,sizeScreen);
       // draw the "sine wave"
       pjs.stroke(midScreen, midScreen, sizeScreen);
       pjs.noFill();
       pjs.bezier(0,midScreen, midScreen/3,midScreen+value,
                  midScreen/3*2,midScreen+value, midScreen,midScreen);
       pjs.bezier(midScreen,midScreen, midScreen+midScreen/3,midScreen+-value,
                  midScreen+midScreen/3*2,midScreen+-value, sizeScreen,midScreen);
       //pjs.endDraw();
     }

     pjs.mouseMoved = function() {
       value = (pjs.mouseY-midScreen);
       pjs.redraw();
     }

     // Finally, calling setup() will kickstart the sketch
     pjs.setup();
     };

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});

