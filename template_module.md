This file contains an example of module that you can use on your creative projects.
The pattern is an IIFE (Immediately Invoked Function Expression)
 (of in french "Expression de fonction invoquée immédiatement") 
 
This pattern is very useful to create local functions and variables, that not pollute the environment of the sketch.

Explanations from MDN on IIFE, in english and french :
https://developer.mozilla.org/en-US/docs/Glossary/IIFE
https://developer.mozilla.org/fr/docs/Glossaire/IIFE


Example of IIFE : the result is an object named myModule which contains all the logic and 

// Change the name of the module for what you want
var myModule = (function () {
    "use strict";

    // Examples of constants (here shortcuts to Math Functions)
    const sin = Math.sin;
    const cos = Math.cos;
    const tan = Math.tan;
    const sqrt = Math.sqrt;
	const PI = Math.PI;

	// Examples of variables inner the object
	var example1 = 'hello';
	var example2 = 'world';
	var datas = [];

	// Examples of functions
	function deg2rad(deg) {
	   return deg * Math.PI / 180;
	}
	   
    function fnc1() {
		// example of 
		let xx = privatefnc1(90);
		console.log("radians for 90 degrees : " + xx);
    }

    function fnc2() {
		console.log(example1 + ' ' + example2);
    }

    function fncX() {
		// add you code here
		console.log("my internal name is fncX, sh..., it's a secret ;)");
    }

    function init() {
		// init function if you need it
    }
	
	function storeData(data) {
		datas.push(data);
		return true;
	}
	
	function getDatas() {
		return datas;
	}

	function privatefnc1(deg) {
		// example of private function (called by fnc1)
		return deg2rad(deg); // example of use of an private function
	}

    // Declare here public functions and constants (the items not declared here are private)
    return {
        init: init,
        fnc1: fnc1,
        fnc2: fnc2,
        fnc3: fncX,
		PI: PI,
		storeData: storeData,
		getDatas: getDatas
      };
})();


It's very easy to use the object myModule : 

myModule.fnc1();                   // radians for 90 degrees : 1.5707963267948966
myModule.fnc2();                   // hello world
myModule.PI;                       // 3.141592653589793
myModule.fncX();                   // !! FAILED !! (because the external name of the method fncX is fnc3)
myModule.fnc3();                   // my internal name is fncX, sh..., it's a secret ;)
myModule.privatefnc1(90);          // !! FAILED !! (because privatefnc1 is not a public method)
myModule.storeData({x:10, y:30});  // true
myModule.getDatas();               // [{x: 10, y: 30}]


You can pass parameters to the object myModule :

var myModule = (function (extrn1, extrn2) {

    // same code as above
	
})(external_object1, external_object2);



For example, to pass jQuery and MomentJS to myModule :

var myModule = (function ($, mo) {

    // same code as above
	
})(jQuery, moment);  // list of objects to pass to myModule

Note that it's possible to change the name of the objects, like "$" and "mo" in the example).
