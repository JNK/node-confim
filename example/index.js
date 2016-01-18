/**
 * Created by jnk on 14.01.16.
 */

// build first: npm run compile

var Confim = require('../dist').default;

var params = {
    file: 'config.json',                // required if raw not set - the path of the file to load
    raw: {},                            // optional - optionally pass a configuration object
    defaultEnvironment: 'development',  // optional - the NODE_ENV to use if not set; defaults to 'development'
    requiredKeyName: '___CONFIM___REQUIRED___' // Specify what string implies that the property is required; defaults to '___CONFIM___REQUIRED___'
};
// Create a confim instance with the above parameters
var cl = Confim.load('', 'config.json');
console.log(cl);
var shared = cl.shared,
    modules = cl.modules,
    conf = cl.conf,
    confim = confim;

// load properties
var sharedLogLevel = confim.shared().loglevel; // either through the shared() method
console.log('Shared Log Level: "%s"', sharedLogLevel);

var sameLogLevel = confim.module('primary-server').loglevel; // or through a module - notice the alias
console.log('Main Server Log Level: "%s" (same as shared)', sameLogLevel);

var specialLogLevel = confim.module('database').loglevel; // this will always be 'info' if not altered through DB_info env variable
console.log('DB Log Level: "%s"', specialLogLevel);
