var s = function( sketch ) {
    "use strict";


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
                engine.rotateX(engine.HALF_PI); // Align with the z axis
                const markThickness = tickIndex % (60 / 12) === 0 ?
                    State.hourMarkThickness : State.minuteMarkThickness;
                engine.cylinder(markThickness, State.markHeight);
                engine.pop();
            }
        }

        function drawAxle() {
            engine.push();
            engine.rotateX(engine.HALF_PI); // Align with the z axis
            engine.cylinder(State.axleThickness, State.axleLength);
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
            engine.cylinder(radius, length);
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

    sketch.setup = function() {
        let c = sketch.createCanvas(mid_width * 2, mid_height * 2, sketch.WEBGL);
        c.parent('#glibcanvas'); // necessary for attach the canvas where you want into the DOM
        clockModule.init(sketch);

        width_by_6 = sketch.width / 6;
        width_by_3 = sketch.width / 3;

        //sketch.loop();  // the call to loop is implicit with P5 (not with ProcessingJS)
    }

    sketch.draw = function() {
        sketch.background( 255 );

        sketch.push();
        //    sketch.translate(sketch.width/2, sketch.height/2);  // to do on ProcessingJS but not on P5
        sketch.rotateY(sketch.PI);  // rotation mandatory to display correctly the time (just comment this line to see what I mean)

        if (clockModule.State.mouseHasMoved) { // Only rotate to mouse position if mouse has been moved since we started
            clockModule.rotateClockWithMouse(sketch.QUARTER_PI);
        }

        clockModule.drawTickMarks(sketch.width * 0.35);
        clockModule.drawAxle();

        const msAfterCurrentSecond = new Date().getTime() % 1000;
        const secondPlusFraction = sketch.second() + msAfterCurrentSecond / 1000;
        const minutePlusFraction = sketch.minute() + secondPlusFraction / 60;
        const hourPlusFraction = sketch.hour() % 12 + minutePlusFraction / 60;

        clockModule.drawHand(hourPlusFraction,   12, 9, width_by_6, clockModule.State.colors.hour, 0);
        clockModule.drawHand(minutePlusFraction, 60, 6, width_by_3, clockModule.State.colors.min, 30);
        clockModule.drawHand(secondPlusFraction, 60, 3, width_by_3, clockModule.State.colors.sec, 60);

        sketch.pop();
    }

    sketch.mouseMoved = function() {
        clockModule.State.mouseHasMoved = true;
    };

    sketch.keyPressed = function(){
        let key = String(sketch.key).toLowerCase();
        if (key == 'x') {
            console.warn('Stop the loop');
            sketch.noLoop();
        }
    }

};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    var myp5 = new p5(s);

});
