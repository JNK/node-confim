/**
 * Created by jnk on 14.01.16.
 */

var Confim = require('../dist/index.js').default;

// var Confim = require('confim').default; // import confim using es5
//import Confim from 'confim'; // import confim using es6

// Create a confim instance with the above parameters
var dbConf = Confim('database').conf;

console.log(dbConf);