
Put a DIV tag in your HTML, like in the example below :
```html
     <div id="glibcanvas"></div>
```

Template for a P5 sketch :

```javascript
var s = function( sketch ) {
    "use strict";

    var mid_width = 400;  // it's often very useful to know the coordinates of the center of the canvas
    var mid_height = 300; // it's often very useful to know the coordinates of the center of the canvas

    var ctx = null; // pointer to the 2D context of P5 (to declare only if you need it)
    var gl  = null; // pointer to the 3D context of P5 (to declare only if you need it)

    sketch.setup = function() {
        let c = sketch.createCanvas(mid_width * 2, mid_height * 2, sketch.WEBGL);
        c.parent('#glibcanvas'); // necessary to fix the canvas where you want into the DOM

        ctx = sketch.drawingContext;  // hook to the 2D context (only if you don't use WEBGL)
        gl  = sketch._renderer.GL;   // hook to the 3D context (only if you use WEBGL)

        // put your code here

      }

      sketch.draw = function() {
          sketch.background( 255 );
          sketch.push();

          // put your code here

          sketch.pop();
      }

      sketch.mouseMoved = function() {
          // put your code here (maybe you don't need mouseMoved function, it's just an example)
      };

      sketch.keyPressed = function(){
          let key = String(sketch.key).toLowerCase();
          if (key == 'x') {
              console.warn('Stop the loop'); // very useful when there is a bug
              sketch.noLoop();
          }
      }

  };

  document.addEventListener("DOMContentLoaded", function(event) {
      console.log("Kickstart the sketch when the DOM is ready (best practice)");
      var myp5 = new p5(s);
  });
```
