/**
 * Created by jnk on 13.01.16.
 */

import util from 'util';
import fs from 'fs';

class Config {

    constructor(params) {
        // load params and defaults
        params = params || {};
        params.defaultEnvironment = params.defaultEnvironment || process.env.CONFIM_defaultEnvironment || 'development';
        //params.checkWhenRequired = params.checkWhenRequired !== true || process.env.CONFIM_checkWhenRequired !== undefined;
        params.requiredKeyName = params.requiredKeyName || process.env.CONFIM_requiredKeyName || '___CONFIM___REQUIRED___';
        this._params = params;

        // init variables
        this._config = {};
        this._aliases = {};
        this._values = {shared:{}, modules:{}};

        // load config
        if (this._params.file === undefined) {
            if (this._params.raw === undefined) {
                throw new Error('Either file or raw need to be defined!');
                return;
            }else if (util.isObject(this._params.raw)) {
                this._config = this._params.raw;
            }else {
                throw new Error('raw parameter needs to be an object!');
                return;
            }
        }else {
            if (util.isString(this._params.file)) {
                this._loadConfiguration();
            }else {
                throw new Error('file parameter needs to be a string!');
                return;
            }
        }

        // check config syntax
        this._validateConfigSyntax();

        // Parse config & env
        this._parseConfiguration();
    }

    /**
     * Read the configuration file into memory
     * @private
     */
    _loadConfiguration() {
        this._config = JSON.parse(fs.readFileSync(this._params.file, 'utf8')) || {};
    }

    /**
     * Check if the configuration contains the required keys
     * @private
     */
    _validateConfigSyntax() {
        // check aliases
        if (!util.isObject(this._config.aliases)) {
            throw new Error('aliases needs to be of type Object{aliasName: realName, ...}!');
            return;
        }else {
            for (var key in this._config.aliases) {
                if (!util.isString(this._config.aliases[key])) {
                    throw new Error('Alias value of key "' + key + '" is not a string!');
                    return;
                }
            }
        }

        // check shared
        if (!util.isObject(this._config.shared)) {
            throw new Error('shared is not an object!');
            return;
        }else {
            for (var key in this._config.shared) {
                if (!util.isObject(this._config.shared[key])) {
                    throw new Error('Shared value of key "' + key + '" is not an object!');
                    return;
                }
            }
        }

        // check modules
        if (!util.isObject(this._config.modules)) {
            throw new Error('modules is not an object!');
            return;
        }else {
            for (var key in this._config.modules) {
                if (!util.isObject(this._config.modules[key])) {
                    throw new Error('module value of key "' + key + '" is not an object!');
                    return;
                }
            }
        }

    }

    /**
     * Do the magic ;)
     * @private
     */
    _parseConfiguration() {

        let env = process.env.NODE_ENV || this._params.defaultEnvironment;

        // load aliases
        this._aliases = this._config.aliases;

        // load shared
        this._loopCheck(this._config.shared['*'], this._values.shared);
        this._loopCheck(this._config.shared[env], this._values.shared);

        // load modules
        for (var module in this._config.modules) {
            if (this._values.modules[module.toLowerCase()] === undefined) {
                this._values.modules[module.toLowerCase()] = util._extend({}, this._values.shared);
            }
            this._loopCheck(this._config.modules[module.toLowerCase()]['*'], this._values.modules[module]);
            this._loopCheck(this._config.modules[module.toLowerCase()][env], this._values.modules[module]);
        }

        // load env into modules & shared
        let output = {};
        this._recurseOverKeys(process.env, output);
        for (let key in output) {
            let value = output[key];
            if (util.isString(value)) {
                this._values.shared[key] = value;
            }else {
                if (this._values.modules[key.toLowerCase()] === undefined) {
                    this._values.modules[key.toLowerCase()] = value;
                }else {
                    this._values.modules[key.toLowerCase()] = util._extend(this._values.modules[key.toLowerCase()], value);
                }
            }
        }

        //if (this._params.checkWhenRequired === false) {
            this._checkMissingRequirements(this._values.shared, '');
            this._checkMissingRequirements(this._values.modules, '');
        //}
    }

    _recurseOverKeys(input, output) {
        for (var key in input) {
            var parts = key.split('_');
            if (parts[0] !== '') {
                var fp = parts[0];
                parts.splice(0, 1);
                if ( output[fp] === undefined) {
                    output[fp] = {};
                }
                if (parts.length === 1) {
                    output[fp][parts.join('_')] = input[key];
                }else if (parts.length === 0) {
                    output[fp] = input[key];
                }else {
                    var nk = parts.join('_');
                    var _input = {};
                    _input[nk] = input[key]
                    this._recurseOverKeys(_input, output[fp]);
                }
            }
        }
    }

    _checkMissingRequirements(input, key) {
        if (util.isObject(input)) {
            for (var v in input) {
                var nk = key === '' ? v.toUpperCase() : key + '_' + v;
                this._checkMissingRequirements(input[v], nk);
            }
        }else if (util.isArray(input)) {
            for (var v in input) {
                this._checkMissingRequirements(input[v], key);
            }
        }else if (util.isString(input)) {
            if (input === this._params.requiredKeyName) {
                throw new Error('Missing key - "' + key +'"!');
            }
        }
    }

    _loopCheck(input, output) {
        if (util.isObject(input)) {
            for (var key in input) {
                output[key] = input[key];
            }
        }
    }

    /**
     * Returns all shared properties
     * @returns {String|Number|Object|undefined}
     */
    shared() {
        return this._values.shared;
    }

    /**
     * Returns the requested module
     * @param name optional parameter. when empty all modules with keys will be returned
     * @returns {Object|{}}
     */
    module(name) {
        let value = name ? this._values.modules[this._aliases[name.toLowerCase()] || name] || {} : this._values.modules;
        return value;
    }
}

export default Config;