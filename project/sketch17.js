var sketch = function( dom_canvas ) {
  "use strict";

    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

    var texture1;
    var texture2;

    var down = new pjs.PVector();
    var drag = new pjs.PVector();

    var qdown = new Quaternion();
    var qnow = new Quaternion();
    var qdrag = new Quaternion();

    var radius = 200;
    var max_width = 800;
    var max_height = 600;
    var width_by_2 = max_width/2
    var height_by_2 = max_height/2;
    var max_tri_strips = 30;
    var max_vertices = 72;
    var vertx = [];
    var verty = [];

    var shapes3d = {};
    shapes3d.top    = {vertices:[], normals:[]};
    shapes3d.bottom = {vertices:[], normals:[]};

    // what to do when an event "change" is triggered on a field form
    var slider_callback = function (self) {
      data_form[self.id] = self.value;
       initPoints();
      return null;
    }

    // list of filters to generate as field forms
    var filters = [];   // count , radius , twist, hcount, phase, hradius
    filters.push({field:"count", min:1, max:100, value:5, step:1, label:"Count", callback:slider_callback});
    filters.push({field:"radius", min:-10, max:100, value:5, step:1, label:"Radius", callback:slider_callback});
    filters.push({field:"twist", min:-2, max:2, value:2, step:.1, label:"Twist", callback:slider_callback});
    filters.push({field:"hcount", min:0, max:2, value:1.5, step:.1, label:"HCount", callback:slider_callback});
    filters.push({field:"phase", min:0, max:4, value:2, step:1, label:"Phase", callback:slider_callback});
    filters.push({field:"hradius", min:-10, max:10, value:5, step:1, label:"HRadius", callback:slider_callback});

    // store live parameters (attached to filters)
    var data_form = {};

    // generate form fields
    multiSliders('form', filters, data_form);

    var first_color = "#E2DE5F";
    var formcolor = {};
    colorPicker('couleur', 'form', first_color, 'Couleur', function(col) { formcolor = col});

    function getR( a, h) {
        return  data_form.pjs_radius * pjs.sin( pjs.radians(a)
            * data_form.pjs_count
            + ( h / 15 )* data_form.pjs_twist)
            + pjs.sin(pjs.radians(3.6 * h) * data_form.pjs_hcount + data_form.pjs_phase)
            * data_form.pjs_hradius + 40;
    }

    function initPoints() {
        for ( let h = 0; h < max_tri_strips; h++) {
            vertx[h] = [];
            verty[h] = [];
            for ( let a = 0; a < max_vertices; a++) {
                let r = getR( a * 5.0, h * 5.0 );
                vertx[h][a] = pjs.cos( pjs.radians( a*5.0 )) * r;
                verty[h][a] = pjs.sin( pjs.radians( a*5.0 )) * r;
            }
        }
        for ( let h = 1; h < max_tri_strips; h++) {
            for ( let a = 0; a <= max_vertices; a++ ) {
                let aa = a % max_vertices;

                shapes3d.top.normals.push({x:vertx[h][aa], y:0, z:verty[h][aa]});
                shapes3d.top.vertices.push({x:vertx[h][aa], y:h*5.0, z:verty[h][aa]});

                shapes3d.top.normals.push({x:vertx[h-1][aa], y:0, z:verty[h-1][aa]});
                shapes3d.top.vertices.push({x:vertx[h-1][aa], y:(h-1)*5.0, z:verty[h-1][aa]});

            }
        }
        let h = max_tri_strips - 1;
        shapes3d.bottom.vertices.push({x:0, y:h*5, z:0});
        for ( let a = 0; a <= max_vertices; a++ ) {
            let aa = a % max_vertices;
            shapes3d.bottom.vertices.push({x:vertx[h][aa], y:h*5, z:verty[h][aa]});
        }
    }

    pjs.setup = function(){
        pjs.size( max_width, max_height, pjs.P3D );
        pjs.frameRate(60);
        initPoints();
    }

    pjs.draw = function() {
        pjs.background( 255 );
      //  pjs.lights();
        pjs.pushMatrix();
        pjs.translate( width_by_2, height_by_2);
        pjs.scale( 1.5 );

        qnow.setQuaternion( qdrag );
        qnow.mult( qdown );
        var matrix = qnow.matrix();
        pjs.rotate( matrix[0], matrix[1], matrix[2], matrix[3] );

        pjs.translate(0, -50, 0);
        pjs.fill( formcolor.rouge, formcolor.vert, formcolor.bleu );

        pjs.beginShape(pjs.TRIANGLE_STRIP );
        shapes3d.top.vertices.forEach((vertex, idx) => {
          //let normal;
          //normal = shapes3d.top.normals[idx];
          //pjs.normal(normal.x, normal.y, normal.z);
          pjs.vertex(vertex.x, vertex.y, vertex.z);
        });

        pjs.endShape();


        pjs.beginShape(pjs.TRIANGLE_FAN);
        shapes3d.bottom.vertices.forEach(vertex => {
          pjs.vertex( vertex.x, vertex.y, vertex.z );
        });
        pjs.endShape();

        pjs.popMatrix();
    }


    function mouseToSphere(x, y) {
        let v = new pjs.PVector();
        v.x = (x - width_by_2) / radius;
        v.y = (y - height_by_2) / radius;
        let mag = v.x * v.x + v.y * v.y;
        if (mag > 1.0) {
            v.normalize();
        } else {
            v.z = pjs.sqrt(1.0 - mag);
        }
        return v;
    }

    pjs.mousePressed = function() {
        down = mouseToSphere( pjs.mouseX, pjs.mouseY );
        qdown.setQuaternion( qnow );
        qdrag = new Quaternion();
    }

    pjs.mouseDragged = function() {
        drag = mouseToSphere( pjs.mouseX, pjs.mouseY );
        qdrag.setCrossDot( down.cross( drag), down.dot( drag ));
    }

    pjs.setup();

};
document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});
