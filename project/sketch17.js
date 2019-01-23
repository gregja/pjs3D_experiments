(function(){
  "use strict";

  var canvas = document.getElementById('glibcanvas');
  var pjs = new Processing(canvas);

  class Quaternion {
    constructor() {
      this.w = 1.0;
      this.x = 0.0;
      this.y = 0.0;
      this.z = 0.0;
    }
    mult( b ) {  // void mult( Quaternion b )
      let res = new Quaternion();
      res.w = this.w * b.w - this.x * b.x - this.y * b.y - this.z * b.z;
      res.x = this.w * b.x + this.x * b.w + this.y * b.z - this.z * b.y;
      res.y = this.w * b.y - this.x * b.z + this.y * b.w + this.z * b.x;
      res.z = this.w * b.z + this.x * b.y - this.y * b.x + this.z * b.w;
      this.setQuaternion( res );
    }
    setCrossDot( cross, dot ) { // void set( PVector cross, float dot )
      this.x = cross.x;
      this.y = cross.y;
      this.z = cross.z;
      this.w = dot;
    }
    setQuaternion( ref ) { // void set( Quaternion ref )
      this.w = ref.w;
      this.x = ref.x;
      this.y = ref.y;
      this.z = ref.z;
    }
    matrix() { // float[] matrix()
      let res = [];
      let sa = Math.sqrt(1.0 - this.w * this.w);
      if (sa < pjs.EPSILON) {
        sa = 1.0;
      }
      res[0] = Math.acos(this.w) * 2.0;
      res[1] = this.x / sa;
      res[2] = this.y / sa;
      res[3] = this.z / sa;
      return res;
    }
  }

  var texture1;
  var texture2;

  var down = null;
  var qdown = new Quaternion();
  var qnow = new Quaternion();
  var qdrag = new Quaternion();

  var max_width = 800;
  var max_height = 600;
  var width_by_2 = max_width/2
  var height_by_2 = max_height/2;
  var max_tri_strips = 30;
  var max_vertices = 72;
  var vertx = [];
  var verty = [];

  /*
  <label>Count : <output data-name="pjs_count" for="pjs_count"></output>
    <input type="range" min="1" max="100" value="50" class="slider" id="pjs_count">
  </label>
  */
  function addSlider( fieldname, domtarget, start, end, value, label ) {
    let xlabel = document.createElement('label');
    xlabel.innerHTML = label + ' : ';
    let xoutput = document.createElement('output');
    xoutput.setAttribute('for', 'pjs_'+fieldname);
    xoutput.value = value;
    xlabel.append(xoutput);
    let xinput = document.createElement('input');
    xinput.setAttribute('type', 'range');
    xinput.setAttribute('min', start);
    xinput.setAttribute('max', end);
    xinput.setAttribute('class', 'slider');
    xinput.setAttribute('id', 'pjs_'+fieldname);
    xinput.value = value;
    xlabel.append(xinput);
    domtarget.append(xlabel);
    xinput.addEventListener('change', function(evt) {
      let output = evt.target.parentNode.querySelector('output');
      output.value = this.value;
      data_form[this.id] = this.value;
    }, false)

  }

  var filters = [];   // count , radius , twist, hcount, phase, hradius
  filters.push({field:"count", min:1, max:20, value:5, label:"Count"});
  filters.push({field:"radius", min:-10, max:10, value:5, label:"Radius"});
  filters.push({field:"twist", min:-2, max:2, value:2, label:"Twist"});
  filters.push({field:"hcount", min:0, max:2, value:1.5, label:"HCount"});
  filters.push({field:"phase", min:0, max:4, value:2, label:"Phase"});
  filters.push({field:"hradius", min:0, max:5, value:5, label:"HRadius"});

  var data_form = {};

  var form = document.getElementById('form');
  filters.forEach(item => {
    addSlider(item.field, form, item.min, item.max, item.value, item.label);
    data_form['pjs_'+item.field] = item.value;
  })

  function getR( a, h) {
    //return pjs.sin( pjs.radians(a) * v1 ) * v2 + 100;
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
  }


  pjs.setup = function(){
    pjs.size( max_width, max_height, pjs.P3D );
    pjs.loop();
  }

  pjs.draw = function() {
    pjs.background( 255 );
    pjs.lights();

    pjs.pushMatrix();
    pjs.translate( width_by_2, height_by_2);
    pjs.scale( 1.5 );

    qnow.setQuaternion( qdrag );
    qnow.mult( qdown );
    var matrix = qnow.matrix();
    pjs.rotate( matrix[0], matrix[1], matrix[2], matrix[3] );

    pjs.translate(0, -50, 0);
    pjs.fill( 255, 0, 0 );

    initPoints(data_form.pjs_count, data_form.pjs_radius);

    pjs.beginShape(pjs.TRIANGLE_STRIP );
    for ( let h = 1; h < max_tri_strips; h++) {
      for ( let a = 0; a <= max_vertices; a++ ) {
        let aa = a % max_vertices;
        pjs.normal( vertx[h][aa], 0, verty[h][aa]);
        pjs.vertex( vertx[h][aa], h*5.0, verty[h][aa] );
        pjs.normal( vertx[h-1][aa], 0, verty[h-1][aa]);
        pjs.vertex( vertx[h-1][aa], (h-1)*5.0, verty[h-1][aa] );
      }
    }
    pjs.endShape();

    pjs.beginShape(pjs.TRIANGLE_FAN);
    let h = max_tri_strips - 1;
    pjs.vertex( 0, h*5, 0 );
    for ( let a = 0; a <= max_vertices; a++ ) {
      let aa = a % max_vertices;
      pjs.vertex( vertx[h][aa], h*5, verty[h][aa] );
    }
    pjs.endShape();

    pjs.popMatrix();
  }


  function mouseToSphere(x, y) {
    let v = new pjs.PVector();
    v.x = (x - width_by_2) / data_form.pjs_radius;
    v.y = (y - height_by_2) / data_form.pjs_radius;
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
      let drag = mouseToSphere( pjs.mouseX, pjs.mouseY );
      qdrag.setCrossDot( down.cross( drag), down.dot( drag ));
  }

  // kickstart the sketch
  pjs.setup();
})();
