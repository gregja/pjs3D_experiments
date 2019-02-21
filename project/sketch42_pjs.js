var sketch = function( dom_canvas ) {
  "use strict";

  var canvas = document.getElementById(dom_canvas);
  var pjs = new Processing(canvas);

  /**
   * Adaptation en P5.js d'un sketch proposé par Tim Jones dans le dossier
   * suivant :
   *
   *  "Data visualization with Processing, Part 1, An introduction
   *  to the language and environment"
   *
   * https://www.ibm.com/developerworks/library/os-datavis/
   */


  /**
   * Fonction permettant de créer des tableaux multi-dimensionnels en JS
   * @param {type} numrows
   * @param {type} numcols
   * @param {type} initial
   * @returns {Array}
   */
  var matrix = function(numrows, numcols, initial) {
      var arr = [];
      for (var i = 0; i < numrows; ++i) {
          var columns = [];
          for (var j = 0; j < numcols; ++j) {
              columns[j] = initial;
          }
          arr[i] = columns;
      }
      return arr;
  };

  var pix = [];

  var toDraw = 0;
  var tree = 0;
  var burningTree = 1;
  var emptySite = 2;
  var x_limit = 400;
  var y_limit = 400;
  var col_brown = null;  // brown
  var col_red = null; // red;
  var col_green = null; // green
  var pGrowth = 0.01;
  var pBurn = 0.00006;

  pjs.setup = function() {
      pjs.size(x_limit, y_limit);

      col_brown = pjs.color(80, 50, 10);
      col_red = pjs.color(255, 0, 0);
      col_green = pjs.color(0, 255, 0);

      pjs.frameRate(60);

      // Aire peuplée initialement d'arbres
      // Les 2 lignes ci-dessous équivalent en Java à :
      //     int[][][] pix = new int[2][400][400];
      pix.push(matrix(x_limit, y_limit, tree));
      pix.push(matrix(x_limit, y_limit, tree));

      /* Initialize to all empty sites */
      for (var x = 0; x < x_limit; x++) {
          for (var y = 0; y < y_limit; y++) {
              pix[toDraw][x][y] = emptySite;
          }
      }
  }

  pjs.draw = function() {
      update();
      for (var x = 0; x < x_limit; x++) {
          for (var y = 0; y < y_limit; y++) {
              //console.log(toDraw, x, y);
              if (pix[toDraw][x][y] === tree)
                  pjs.stroke(col_green);
              else if (pix[toDraw][x][y] === burningTree)
                  pjs.stroke(col_red);
              else
                  pjs.stroke(col_brown);
              pjs.point(x, y);
          }
      }
      toDraw = (toDraw === 0) ? 1 : 0;
  }

  var prob = function (p) {
      if (pjs.random(0, 1) < p) {
          return true;
      } else {
          return false;
      }
  };

  function update() {
      var x, y, xmax, ymax, dx, dy, cell, chg, burningTreeCount;
      var toCompute = (toDraw === 0) ? 1 : 0;
      for (x = 1, xmax = x_limit - 1; x < xmax; x++) {
          for (y = 1, ymax = y_limit - 1; y < ymax; y++) {
              cell = pix[toDraw][x][y];
              // Survey area for burning trees
              burningTreeCount = 0;
              for (dx = -1; dx < 2; dx++) {
                  for (dy = -1; dy < 2; dy++) {
                      if ((dx === 0) && (dy === 0)) {
                          continue;
                      } else {
                          if (pix[toDraw][x + dx][y + dy] === burningTree) {
                              burningTreeCount++;
                          }
                      }
                  }
                  // Determine next state
                  if (cell === burningTree) chg = emptySite;
                  else if ((cell === emptySite) && (prob(pGrowth))) chg = tree;
                  else if ((cell === tree) && (prob(pBurn))) chg = burningTree;
                  else if ((cell === tree) && (burningTreeCount > 0)) chg = burningTree;
                  else chg = cell;

                  pix[toCompute][x][y] = chg;
              }
          }
      }
  }


  // kickstart the sketch
  pjs.setup();
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("Kickstart the sketch when the DOM is ready (best practice)");
  sketch('glibcanvas');
});
