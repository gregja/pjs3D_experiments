var sketch = function( dom_canvas ) {

    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

    var vertexShader = document.getElementById('vertexShader');
    var fragmentShader = document.getElementById('fragmentShader');

    let pos, posBuf;
    let gl;
    let time = 0.0;

    var width = 400;
    var height = width;

    var flag_stop = false;

    pjs.setup = function() {
        pjs.size(width, height, pjs.P3D);

        gl = pjs.externals.context

        gl.enable(gl.DEPTH_TEST)
        gl.depthFunc(gl.LEQUAL)

        $prog(gl, [vertexShader, fragmentShader])
        posBuf = $buf([1,1,0,-1,1,0,1,-1,0,-1,-1,0])
        pos = $attr("pos")

        scene(0);   //pjs.loop();
    }

    /*
      *  WARNING : impossible d'utiliser une fonction draw() classique pour cause de conflit entre P5 et Glutz,
      *            avec des conflits de ce type :
      *                WebGL: INVALID_OPERATION: uniform1f: location not for current program
     */
    function scene(time) {
    	// clear screen
    	gl.clearColor(1/5, 1/5, 1/5, 1);
    	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // on peut utiliser certains fonctions de ProcessingJS (fonctions mathématiques, vertexs, etc...) et c'est cool,
        // mais attention, l'association entre Glutz et ProcessingJS est très expérimentale et sans garantie ;)
        // console.log(pjs.mouseX);

    	// bind attributes to buffers
    	$bind(pos, posBuf, 3);

    	// set uniforms
    	$uni("time", time * 1e-3);
    	$uniV("resolution", [width,height]);

    	// draw
    	gl.drawArrays(gl.TRIANGLE_STRIP,0,4);

        if (!flag_stop) {
    	    requestAnimationFrame(scene);
        }
    }

    pjs.keyPressed = function(){
        let key = String(pjs.key).toLowerCase();
        if (key == 'x') {
            console.warn('Stopped the loop');
            flag_stop = true;
        }
    }

    // kickstart the sketch
    pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("Kickstart the sketch when the DOM is ready (best practice)");
    sketch('glibcanvas');
});
