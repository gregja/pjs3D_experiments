// Original version by : Tomokazu Takahashi    ( https://www.openprocessing.org/sketch/557436 )
// Rewritten in OOP by : Gregory Jarrige

var sketch = function( dom_canvas ) {
    "use strict";

    var canvas = document.getElementById(dom_canvas);
    var pjs = new Processing(canvas);

    class Stage {
        constructor(us, sw, sh, adjustX, colors) {
            this.us = us; // size of a block in pixels (square)
            this.sw = sw; // blocks on stage horizontally
            this.sh = sh; // blocks on stage vertically
            this.gr = new Array(sh); // Grid binded by the stage
            this.adjustX = adjustX;
            this.bcolors = colors;
            this.status = 0; // 0=Wait (click to start) ; 1=Wait (game over, play again) ; 2=Play...
            this.cnvWidth = this.sw*this.us - this.adjustX;
            this.cnvHeight = this.sh*this.us - this.adjustX
        }
        init() {
            for(let j=0; j<this.sh; j++){
                this.gr[j] = new Array(this.sw);
                for(let i=0; i<this.sw; i++){
                    this.gr[j][i] = 0;
                }
            }
            for(let j=0; j<this.sh-1; j++){
                this.gr[j][0] = this.gr[j][this.sw-1]=1;
            }
            for(let i=0; i<this.sw; i++){
                this.gr[this.sh-1][i] = 1;
            }
        }
        draw(engine) {
            for(let j=0; j < this.sh; j++){
                for(let i=0; i < this.sw; i++){
                    if(this.gr[j][i] > 0){
                        let bc = this.bcolors[this.gr[j][i]];
                        let x = i * this.us + this.adjustX;
                        let y = j * this.us;
                        this.drawBox(engine, bc, x, y, this.us);
                    }
                }
            }
            if (this.status == 0) {
                this.drawMessage(engine, "Click HERE to start");
            } else {
                if (this.status == 1) {
                    this.drawMessage(engine, "Click to replay");
                }
            }
        }
        drawBox(engine, _c, _x, _y, _s) {
            engine.fill(_c[0], _c[1], _c[2]);
            engine.pushMatrix();
            engine.translate(_x, _y, 0);
            engine.box(_s);
            engine.popMatrix();
        }
        drawMessage(engine, _t ) {
            let font = engine.loadFont("Courier New");
            engine.textFont(font, 20);
            engine.textAlign(engine.CENTER);
            engine.fill(200);
            engine.text(_t, this.cnvWidth/2, this.cnvHeight/2, 30);
        }
        gameOver() {
            this.status = 1;
        }
        restart() {
            this.status = 2;
            this.gr = new Array(this.sh);
            this.init();
        }
    }

    class Block {
        constructor (gr, stage) {
            this.gr = gr;
            this.w = this.gr[0].length;
            this.h = this.gr.length;
            this.x = Math.floor((stage.sw-this.w)/2);
            this.y = 0;
            this.stage = stage;

            // search the prior color of the shape selected
            let xcol = null;
            for(let i=0; i<this.h && xcol == null; i++) {
                for (let j=0; j<this.w && xcol == null; j++) {
                    if (this.gr[i][j] > 0) {
                        xcol = this.gr[i][j];
                    }
                }
            }
            this.colors = stage.bcolors[xcol];
        }
        leftRotate() {
            let ret=Array(this.gr.length);
            for(let j=0; j < this.h; j++){
                ret[j] = Array(this.gr[j].length);
                for(let i=0; i < this.w; i++){
                    ret[j][i] = this.gr[i][this.h-1-j];
                }
            }
            return ret;
        }
        rightRotate() {
            let ret=Array(this.gr.length);
            for(let j=0; j < this.h; j++){
                ret[j] = Array(this.gr[j].length);
                for(let i=0; i < this.w; i++){
                    ret[j][i] = this.gr[this.w-1-i][j];
                }
            }
            return ret;
        }
        draw(engine) {
            for(let j=0; j < this.h; j++){
                for(let i=0; i < this.w; i++){
                    if(this.gr[j][i] > 0){
                        let x = (this.x+i) * this.stage.us + this.stage.adjustX;
                        let y = (this.y+j) * this.stage.us;
                        let size = this.stage.us;
                        this.drawBox(engine, this.colors, x, y, size);
                    }
                }
            }
        }
        drawBox(engine, _c, _x, _y, _s) {
            engine.fill(_c[0], _c[1], _c[2]);
            engine.pushMatrix();
            engine.translate(_x, _y, 0);
            engine.box(_s);
            engine.popMatrix();
        }
        fixOnStage(){
            for(let j=0; j < this.h; j++){
                for(let i=0; i < this.w; i++){
                    if(this.gr[j][i] > 0){
                        this.stage.gr[this.y+j][this.x+i] = this.gr[j][i];
                    }
                }
            }
        }
        hasSpace(_x, _y, _otherBlock=false){
            let _b = _otherBlock || this.gr;
            for(let j=0; j < this.h; j++) {
                for(let i=0; i < this.w; i++) {
                    if( _b[j][i] > 0
                        && (_y+j < this.stage.sh)
                        && (0 <= _x+i && _x+i < this.stage.sw)
                        && this.stage.gr[_y+j][_x+i] > 0) {
                            return false;

                    }
                }
            }
            return true;
        }
    }

    var frame = 0, frame_interval = 10;
    var k = -1; // current key pressed (if <> -1)

    var blocks=[
              [[0,0,0,0],
               [2,2,2,2],
               [0,0,0,0],
               [0,0,0,0]],
              [[3,3],
               [3,3]],
              [[0,4,4],
               [4,4,0],
               [0,0,0]],
              [[5,5,0],
               [0,5,5],
               [0,0,0]],
              [[6,0,0],
               [6,6,6],
               [0,0,0]],
              [[0,0,7],
               [7,7,7],
               [0,0,0]],
              [[0,8,0],
               [8,8,8],
               [0,0,0]]
              ];
    var max_shapes = blocks.length;

    var bcolors = [
                  [0,0,0],
                  [255,255,255],
                  [255,0,0],
                  [255,255,0],
                  [255,0,255],
                  [0,255,0],
                  [0,0,255],
                  [255,127,0],
                  [0,255,255]
              ];

    var stage = new Stage(30, 12, 21, 10, bcolors);
    var block = {}; // current block with dimensions (w, h), coordinates (x, y) and shape (gr)

    pjs.setup = function(){
        pjs.size(stage.cnvWidth + 30, stage.cnvHeight, pjs.P3D);
        pjs.frameRate(30);
        stage.init();
    }

    pjs.draw = function(){
        pjs.background(0);
        pjs.camera(0, 0, (pjs.height/2.0) / pjs.tan(pjs.PI*30.0 / 180.0), pjs.mouseX, pjs.mouseY, 0, 0, 1, 0);

        pjs.directionalLight(126, 126, 126, 0, 0, -1);
        pjs.ambientLight(102, 102, 102);

        stage.draw(pjs);
        if (stage.status == 2) {
            block.draw(pjs);

            frame++;
            if(frame>=frame_interval){
                frame=0;
                if(block.hasSpace(block.x, block.y+1)) {
                    block.y++;
                } else {
                    block.fixOnStage();
                    clear_lines();
                    generate_block();
                }
            }
            if (k != -1) {
                switch(k){
                    case pjs.RIGHT:{
                        if(block.hasSpace(block.x+1, block.y)) {
                            block.x++;
                        }
                        break;
                    }
                    case pjs.LEFT:{
                        if(block.hasSpace(block.x-1, block.y)) {
                            block.x--;
                        }
                        break;
                    }
                    case pjs.DOWN:{
                        if(block.hasSpace(block.x, block.y+1)) {
                            block.y++;
                        }
                        break;
                    }
                    case "w":{
                        let tmp_block = block.leftRotate(); // left_rotate(block.gr);
                        if(block.hasSpace(block.x, block.y, tmp_block)) {
                            block.gr = tmp_block;
                        }
                        k = -1;
                        break;
                    }
                    case "x":{
                        let tmp_block = block.rightRotate(); // right_rotate(block.gr);
                        if(block.hasSpace(block.x, block.y, tmp_block)) {
                            block.gr = tmp_block;
                        }
                        k = -1;
                        break;
                    }
                }
            }
        }
    }

    function clear_lines(){
        for(let j=0; j<block.h; j++){
            if(block.y+j <= stage.sh-2){
                let is_line = true;
                for(let i=0; i<stage.sw-2; i++){
                    if(stage.gr[block.y+j][i+1] == 0){
                        is_line = false;
                        break;
                    }
                }
                if(is_line){
                    for(let jj=0; jj<block.y+j; jj++){
                        for(let ii=0; ii<stage.sw-2; ii++){
                            stage.gr[block.y+j-jj][ii+1] = stage.gr[block.y+j-jj-1][ii+1];
                        }
                    }
                    for(let ii=0; ii<stage.sw-2; ii++){
                        stage.gr[0][ii+1] = 0;
                    }
                }
            }
        }
    }

    function generate_block(){
        let item = Math.floor(pjs.random(max_shapes));
        block = new Block(blocks[item], stage);

        if(!block.hasSpace(block.x, block.y)){
            stage.gameOver();
        }
    }

    pjs.mouseClicked = function () {
        if (stage.status < 2) {
            pjs.randomSeed(pjs.random(9));
            stage.restart();
            generate_block();

        }
    };

    pjs.keyPressed = function(){
        if (pjs.key == pjs.CODED) {
            if (pjs.keyCode == pjs.RIGHT || pjs.keyCode == pjs.LEFT || pjs.keyCode == pjs.DOWN){
                k = pjs.keyCode;
            }
        } else {
            let key = String(pjs.key).toLowerCase();
            if (key == 'w' || key == 'x') {
                k = key;
            }
        //    if (key == 'q') {
        //        pjs.noLoop();
        //    }
        }
    };

    pjs.keyReleased = function(){
        k = -1;
    };

    // kickstart the sketch
    pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});
