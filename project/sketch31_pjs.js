var sketch = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    if (!canvas) {
      console.warn('Canvas tag not found in the DOM, failed to start ProcessingJS');
      return;
    }
    var pjs = new Processing(canvas);

    var clockModule = (function() {
        "use strict";

        var engine = null; // to store the instance of ProcessingJS or P5js

        // This version adds color mouse-controlled rotation
        var State = {
            hourMarkThickness:      10,
            minuteMarkThickness:    5,
            markHeight:             10,
            axleThickness:          10,
            axleLength:             200,
            mouseHasMoved:          false // Whether the mouse has moved since the program started
        };

        // the cylinder function doesn't exist on ProcessingJS (it exists on P5js)
        // so this function is a modest polyfill
        function cylinder(_r, _h, _numSegments=24 ){
            let segments = _numSegments;
            let h = _h;
            let r = _r;
            let angle = 360.0 / segments;
            let h_div_2 = h / 2;
            engine.beginShape();
            for ( let i = 0; i < segments; i++ ) {
                let x = engine.cos( engine.radians( angle * i ) ) * r;
                let y = engine.sin( engine.radians( angle * i ) ) * r;
                engine.vertex( x, y, -h_div_2 );
            }
            engine.endShape( engine.CLOSE );
            engine.beginShape( engine.QUAD_STRIP );
            for ( let i = 0; i < segments + 1; i++ ) {
                let x = engine.cos( engine.radians( angle * i ) ) * r;
                let y = engine.sin( engine.radians( angle * i ) ) * r;
                engine.vertex( x, y, -h_div_2 );
                engine.vertex( x, y, h_div_2 );
            }
            engine.endShape();
            engine.beginShape();
            for ( let i = 0; i < segments; i++ ) {
                let x = engine.cos( engine.radians( angle * i ) ) * r;
                let y = engine.sin( engine.radians( angle * i ) ) * r;
                engine.vertex( x, y, h_div_2 );
            }
            engine.endShape( engine.CLOSE );
        }

        /**
         * Draws tick marks along the circumference of the clock.
         * @param radius the radius of the circle along which the marks are drawn
         */
        function drawTickMarks(radius) {
            engine.fill(State.colors.ticks);

            for (let tickIndex = 0; tickIndex < 60; ++tickIndex) {
                engine.push();
                engine.rotateZ(tickIndex * engine.TWO_PI / 60);
                engine.translate(radius, 0, 0);
                //engine.rotateX(engine.HALF_PI); // Align with the z axis (necessary on P5 but not on ProcessingJS)
                const markThickness = tickIndex % (60 / 12) === 0 ?
                    State.hourMarkThickness : State.minuteMarkThickness;
                cylinder(markThickness, State.markHeight);
                engine.pop();
            }
        }

        function drawAxle() {
            engine.push();
        //    engine.rotateX(engine.HALF_PI); // Align with the z axis (necessary on P5 but not on ProcessingJS)
            cylinder(State.axleThickness, State.axleLength);
            engine.pop();
        }

        /**
         * Draws a clock hand.
         * @param position the position (seconds, minutes, or hours). A real number.
         * @param maxUnits 60 or 12
         * @param radius the radius of the cylinder forming the hand
         * @param length the length of the cylinder
         * @param color the color of the cylinder
         * @param z where the hand is positioned along the z axis
         */
        function drawHand(position, maxUnits, radius, length, color, z) {
            engine.push();
            engine.fill(color);
            engine.rotateZ(-position / maxUnits * engine.TWO_PI);
            engine.translate(0, -length / 2, z);
            engine.rotateX(engine.HALF_PI); // Align with the z axis (necessary on ProcessingJS but not on P5)
            cylinder(radius, length);
            engine.pop();
        }

        function rotateClockWithMouse(maxRotationRadians) {
            function angleFromMouse(mousePos) {
                return engine.map(mousePos, 0, engine.width - 1, -maxRotationRadians, maxRotationRadians);
            }
            engine.rotateY(angleFromMouse(engine.mouseX));
            engine.rotateX(angleFromMouse(engine.mouseY));
        }

        function init(_engine) {
            engine = _engine;
            if (!engine.pop) {
                engine.pop = engine.popMatrix;
                engine.push = engine.pushMatrix;
            }
            State.colors = { // Set this here because the color function isn’t available before
                ticks: engine.color(59, 71, 248),
                hour:  engine.color(51, 136, 217),
                min:   engine.color(69, 233, 240),
                sec:   engine.color(51, 217, 144)
            };
        }

        // Déclaration des méthodes et propriétés publiques
        return {
           init: init,
           State: State,
           rotateClockWithMouse: rotateClockWithMouse,
           drawTickMarks: drawTickMarks,
           drawAxle: drawAxle,
           drawHand: drawHand
        };
    })();

    var mid_width = 400;
    var mid_height = 300;
    var width_by_6, width_by_3;

    pjs.setup = function() {
        pjs.size(mid_width * 2, mid_height * 2, pjs.P3D);

        clockModule.init(pjs);

        width_by_6 = pjs.width / 6;
        width_by_3 = pjs.width / 3;

        pjs.loop(); // the call to loop is implicit with P5 but not with ProcessingJS
    }

    pjs.draw = function() {
        pjs.background( 255 );

        pjs.pushMatrix();
        pjs.translate(mid_width, mid_height); // translate to the middle of the canvas is mandatory with ProcessingJS
        pjs.rotateY(pjs.PI);  // rotation mandatory to display correctly the time (just comment this line to see what I mean)

        if (clockModule.State.mouseHasMoved) { // Only rotate to mouse position if mouse has been moved since we started
            clockModule.rotateClockWithMouse(pjs.QUARTER_PI);
        }

        clockModule.drawTickMarks(pjs.width * 0.35);
        clockModule.drawAxle();

        const msAfterCurrentSecond = new Date().getTime() % 1000;
        const secondPlusFraction = pjs.second() + msAfterCurrentSecond / 1000;
        const minutePlusFraction = pjs.minute() + secondPlusFraction / 60;
        const hourPlusFraction = pjs.hour() % 12 + minutePlusFraction / 60;

        clockModule.drawHand(hourPlusFraction,   12, 9, width_by_6, clockModule.State.colors.hour, 0);
        clockModule.drawHand(minutePlusFraction, 60, 6, width_by_3, clockModule.State.colors.min, 30);
        clockModule.drawHand(secondPlusFraction, 60, 3, width_by_3, clockModule.State.colors.sec, 60);

        pjs.popMatrix();
    }

    pjs.mouseMoved = function() {
        clockModule.State.mouseHasMoved = true;
    };

    pjs.keyPressed = function(){
        let key = String(pjs.key).toLowerCase();
        if (key == 'x') {
            console.warn('Stop the loop');
            pjs.noLoop();
        }
    }

    // kickstart the sketch
    pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    sketch('glibcanvas');
});
