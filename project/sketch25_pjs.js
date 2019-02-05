var pjs = function( dom_canvas ) {
    "use strict";
// https://library.fridoverweij.com/codelab/menger_fractals/menger_sponge_p5.html
    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

    var params = {
    	size: 250,
    	maxLevel: 2, 	// maximum order of the fractal. Be careful with making this integer value too large
    	rotate: "auto"  // auto rotate or manual (drag with mouse or finger).
    };

    var mid_width = 250;
    var mid_height = mid_width;

    var rotX, rotY;
    var interact; // is true if mouse is pressed or finger touches container. Used in "manual mode".

    // code for user controls
    var inputs = {
    	rotate: document.getElementsByName("rotate"),
    	order: document.getElementsByName("order"),
      style: document.getElementsByName("style"),

    };

    for (let i = 0, imax=inputs.order.length; i < imax; i++) {
    	inputs.order[i].onclick = function() {
    		params.maxLevel = parseInt(this.value);
    		pjs.redraw();
    	}
    	if (inputs.order[i].checked) {
    		params.maxLevel = parseInt(inputs.order[i].value);
    	}
    };

    for (let i = 0, imax=inputs.rotate.length; i < imax; i++) {
    	inputs.rotate[i].onclick = function() {
    		params.rotate = this.value;
    		pjs.redraw();
    	}
    	if (inputs.rotate[i].checked) {
    		params.rotate = inputs.rotate[i].value;
    	}
    };

    for (let i = 0, imax=inputs.style.length; i < imax; i++) {
    	inputs.style[i].onclick = function() {
    		params.style = this.value;
    		pjs.redraw();
    	}
    	if (inputs.style[i].checked) {
    		params.style = inputs.style[i].value;
    	}
    };

    // END code for user controls
    function doThisOnInteract() { interact = true; return false; /* prevent default */ }
    function doThisOnInteractEnded() {interact = false; return false; /* prevent default */ }

    function sponge(x,y,z,r,level) {
    	if (level > 0 && level <= params.maxLevel && level <= 3) {
    		let newR = r/3;
    		let pos = [];
    		for (let i = -1; i < 2; i++) {
    			for (let j = -1; j < 2; j++) {
    				for (let k = -1; k < 2; k++) {
    					// Of the mid boxes always at least 2 coordinates are 0. Thus for those not to be drawn boxes: sum <= 1.
    					// Inspired by: The Coding Train: Coding Challenge #2: Menger Sponge Fractal, https://youtu.be/LG8ZK-rRkXo
    					let sum = Math.abs(i) + Math.abs(j)+ Math.abs(k);
    					if (sum > 1) {
    						let t = pos.length;
    						pos[t] = { x:x+i*newR, y:y+j*newR, z:z+k*newR };
    						if (level === params.maxLevel) {
    							pjs.pushMatrix();
    							pjs.translate(pos[t].x, pos[t].y, pos[t].z);
    							pjs.box(newR, newR, newR);
    							pjs.popMatrix();
    						}
    					}
    				}
    			}
    		}
    		// recursion
    		let nextLevel = level + 1;
    		for (let t=0, tmax=pos.length; t < tmax; t++) {
    			sponge(pos[t].x, pos[t].y, pos[t].z, newR, nextLevel);
    		}
    	}
    };

    pjs.setup = function() {
        pjs.size(mid_width * 2, mid_height * 2, pjs.P3D);

        pjs.loop();
        rotX = 30 * Math.PI / 180;
        rotY = 30 * Math.PI / 180;

    };

    pjs.draw = function() {
      pjs.pushMatrix();
      pjs.translate(mid_width, mid_height);
    	pjs.background(255);
    	pjs.rotateX(rotX);
    	pjs.rotateY(rotY);
    	if (params.rotate === "manual") {
    		//drag to move the world.
    		//orbitControl();

    		//if(mouseIsPressed){
    		if(interact) {
    			rotX = pjs.mouseY * Math.PI / 180;
    			rotY = pjs.mouseX * Math.PI / 180;
    		}
    		pjs.rotateX(rotX);
    		pjs.rotateY(rotY);
    	} else {
    		pjs.rotateZ(pjs.frameCount * 0.01);
    		pjs.rotateX(pjs.frameCount * 0.01);
    		pjs.rotateY(pjs.frameCount * 0.01);
    	}

      if (params.style === "2") {
        pjs.pointLight(250, 250, 250, 0, 0, 50);
        pjs.ambientLight(100, 102, 0);
      	pjs.fill(200, 100, 100);
      } else {
        pjs.noFill();
      }

    	sponge(0,0,0,params.size,1);

      pjs.popMatrix();
    };

    pjs.windowResized = function() {
      pjs.resizeCanvas(widthCanvas(), heightCanvas);
    };

    pjs.mousePressed = function() {
      doThisOnInteract();
    }
    pjs.touchStarted = function() {
      doThisOnInteract();
    }
    pjs.mouseReleased = function() {
      doThisOnInteractEnded();
    }
    pjs.touchEnded = function() {
      doThisOnInteractEnded();
    }

    // kickstart the pjs
    pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the pjs when the DOM is ready (best practice)");
  pjs('glibcanvas');
});
