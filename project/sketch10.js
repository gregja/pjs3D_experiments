
(function(){
  "use strict";

  var canvas = document.getElementById('glibcanvas');
  var pjs = new Processing(canvas);

  var modes = [];
  modes.push({key:'n', 'mode': 'No lights', value:0});
  modes.push({key:'l', 'mode': 'Lights', value:1});
  modes.push({key:'d', 'mode': 'Directional Light (use target keys with that mode)', value:2});
  modes.push({key:'a', 'mode': 'Ambient Light', value:3});
  modes.push({key:'p', 'mode': 'Point Light', value:4});
  modes.push({key:'s', 'mode': 'Spot Light', value:5});

  var legend = document.getElementById('legend');
  var txtlegend = '<p>Click on the graph before to use the lights modes below</p>'+
                  '<p>Lights modes associated to the keyboard:</p><ul>';
  modes.forEach(item => {
    txtlegend += `<li>${item.key.toUpperCase()} : ${item.mode}</li>`;
  });
  txtlegend += '</ul>';
  legend.innerHTML = txtlegend;

  var lightMode = 1;
  var lightDirection = 0;

  var current_mode = document.getElementById('current_mode');
  current_mode.innerHTML = `<p>Current Mode : ${modes.find(item => item.value == lightMode).mode}</p>`;


  pjs.setup = function() {
    pjs.size(600, 600, pjs.P3D);
    pjs.loop();
  }

  pjs.draw = function() {
    pjs.background( 0 );
    switch ( lightMode ) {
      case 0:{
        pjs.noLights();
        break;
      }
      case 1:{
        pjs.lights();
        break;
      }
      case 2:{
        if ( lightDirection == 0 ) {
          pjs.directionalLight( 255, 128, 0, 0, -1, 0 ); // UP
        } else if ( lightDirection == 1 ) {
          pjs.directionalLight( 0, 255, 0, 1, 0, 0 ); // RIGHT
        } else if ( lightDirection == 2 ) {
          pjs.directionalLight( 255, 0, 255, 0, 1, 0 ); // DOWN
        } else if ( lightDirection == 3 ) {
          pjs.directionalLight( 0, 255, 255, -1, 0, 0 ); // LEFT
        }
        break;
      }
      case 3:{
        pjs.ambientLight( 0, 255, 255 );
        break;
      }
      case 4:{
        pjs.pointLight( 255, 255, 0, 100, pjs.height*0.3, 100 );
        break;
      }
      case 5:{
        pjs.spotLight( 128, 255, 128, 800, 20, 300, -1, .25, 0, pjs.PI, 2 );
        break;
      }
      default:{
        pjs.noLights();
      }
    }

    pjs.pushMatrix();
    pjs.translate( pjs.width/2, pjs.height/2, 0 );
    pjs.pushMatrix();
    pjs.rotateY( pjs.radians( pjs.frameCount ) );
    pjs.fill( 255 );
    pjs.noStroke();
    pjs.sphere( 100 );
    pjs.popMatrix();

    pjs.pushMatrix();
    pjs.rotateZ( pjs.radians( pjs.frameCount ) );
    pjs.rotateX( pjs.radians( pjs.frameCount/2 ) );
    pjs.fill( 255 );
    pjs.noStroke();
    pjs.box( 150 );
    pjs.popMatrix();

    pjs.popMatrix();
  }

  pjs.keyPressed = function(){
    let touchkey = String(pjs.key).toLowerCase();
    let touchcode = pjs.keyCode;
    let check = modes.find(item => item.key == touchkey);
    if (check && check.value != lightMode) {
      lightMode = check.value;
      current_mode.innerHTML = `<p>Current Mode : ${modes.find(item => item.value == lightMode).mode}</p>`;
    }

    if ( lightMode == 2) {
      switch ( touchcode ) {
        case pjs.UP:{
          lightDirection = 0;
          break;
        }
        case pjs.RIGHT:{
          lightDirection = 1;
          break;
        }
        case pjs.DOWN:{
          lightDirection = 2;
          break;
        }
        case pjs.LEFT:{
          lightDirection = 3;
          break;
        }
      }
    }
  }

   // kickstart the sketch
   pjs.setup();
})();
