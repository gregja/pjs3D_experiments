(function(){
    "use strict";

    var canvas = document.getElementById('glibcanvas');
    var pjs = new Processing(canvas);

    var angle_rotation_y = 0.0;
    var sphere;
    var max_width = 800;
    var max_height = 600;
    var width_by_2 = max_width/2
    var height_by_2 = max_height/2;

    var r = 150;
    var step = 20;

    pjs.setup = function() {
        pjs.size(max_width, max_height, pjs.P3D);
        pjs.frameRate(25);
        sphere = new Sphere( 150, 10, pjs);
        sphere.calculus();
    }

    pjs.draw = function() {
        pjs.background( 255 );
        pjs.pushMatrix();

        pjs.translate( width_by_2, height_by_2 );
        pjs.lights();
        pjs.ambientLight(128,128,128);
        //pjs.pointLight(255,255,255,-250,-250,500);
        //pjs.pointLight( 255, 255, 0, 100, pjs.height*0.3, 100 );
        //pjs.directionalLight(128,128,128,0,0,-1);

        pjs.pushMatrix();
        pjs.rotateX( pjs.radians(-30));
        pjs.rotateY( angle_rotation_y );
        angle_rotation_y += 0.01;

        pjs.fill( 255, 0, 0 );
        pjs.beginShape(pjs.QUAD_STRIP);

        sphere.render();

        pjs.endShape();

        pjs.popMatrix();
        pjs.popMatrix();
    }


    // kickstart the sketch
    pjs.setup();
})();
