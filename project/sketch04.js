(function(){
"use strict";

var canvas = document.getElementById('glibcanvas');
var pjs = new Processing(canvas);

class Spin {

  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.speed = s;
    this.angle = 0.0;
  }
  update() {
    this.angle += this.speed;
  }
}

class SpinArm extends Spin {
  constructor(x, y, s) {
    super(x, y, s);
  }
  display() {
    pjs.strokeWeight(1);
    pjs.stroke(0);
    pjs.pushMatrix();
    pjs.translate(this.x, this.y);
    this.angle += this.speed;
    pjs.rotate(this.angle);
    pjs.line(0, 0, 66, 0);
    pjs.popMatrix();
  }
}

class SpinSpots extends Spin{
  constructor(x, y, s, d) {
    super(x, y, s);
    this.dim = d;
  }
  display() {
    pjs.noStroke();
    pjs.pushMatrix();
    pjs.translate(this.x, this.y);
    this.angle += this.speed;
    pjs.rotate(this.angle);
    pjs.ellipse(-this.dim/2, 0, this.dim, this.dim);
    pjs.ellipse(this.dim/2, 0, this.dim, this.dim);
    pjs.popMatrix();
  }
}

    var arm, spots;
    // Definition for the initial entry point
    pjs.setup = function() {
       pjs.size(400,400);
       pjs.smooth();
       arm = new SpinArm(pjs.width/2, pjs.height/2, 0.01);
       spots = new SpinSpots(pjs.width/2, pjs.height/2, -0.02, 33.0);
       pjs.loop();
     }

     pjs.draw = function() {
       pjs.background(204);
       arm.update();
       arm.display();
    //   console.log(arm);
       spots.update();
       spots.display();
    //   console.log(spots);
     }


     // Finally, calling setup() will kickstart the sketch
     pjs.setup();
     })();
