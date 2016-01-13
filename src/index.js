/**
 * Created by jnk on 13.01.16.
 */

import util from 'util';

class Config {
    constructor(options) {
        options = options || {};
        this._path = util.isString(options) ? options : options.path;

        this._deaultEnvironment = util.isObject(options) ? (options.defaultEnvironment || 'development' ) : 'development';

        this._values = {};
        this._values.env = {};
        this._values.modules = {};
        this._values.shared = {};
        this._aliases = {};

        this._loadConfig();
    }

    _loadConfig() {
        this._fileConf = require(this._path);
        this._aliases = this._fileConf.aliases || {};
        this._loadEnv();
    }

    _loadEnv() {
        for (let e in process.env) {
            let ep = e.split('_');
            if (this._aliases[ep[0].toLowerCase()] || this._fileConf[ep[0].toLowerCase()]) {
                let nep = this._values[ep[0].toLowerCase()] || {};
                nep[ep[1]] = process.env[e];
                this._values[this._aliases[ep[0].toLowerCase()] || ep[0].toLowerCase()] = nep;
            }else {
                if (this._values.env[e] === undefined) {
                    this._values.env[e] = {};
                }
                this._values.env[e] = process.env[e];
            }
        }

        this._loadFile();
    }

    _loadFile() {
        let env = process.env.NODE_ENV || this._deaultEnvironment;

        if (this._fileConf['*']) {
            if (this._fileConf.shared['*']) {
                for (var e in this._fileConf.shared['*']) {
                    if (this._values.shared[e] === undefined) {
                        this._values.shared[e] = {};
                    }
                    this._values.shared[e] = this._fileConf.shared['*'][e];
                }
            }
            if (this._fileConf.shared[env]) {
                for (var e in this._fileConf.shared[env]) {
                    if (this._values.shared[e] === undefined) {
                        this._values.shared[e] = {};
                    }
                    this._values.shared[e] = this._fileConf.shared[env][e];
                }
            }
        }

        for (var ns in this._fileConf.modules || {}) {
            if (this._fileConf.modules[ns]['*']) {
                for (var e in this._fileConf.modules[ns]['*']) {
                    if (this._values.modules[ns] === undefined) {
                        this._values.modules[ns] = {};
                        if (this._values.modules[ns][e] === undefined) {
                            this._values.modules[ns][e] = {};
                        }
                    }
                    this._values.modules[ns][e] = this._fileConf.modules[ns]['*'][e];
                }
            }
            if (this._fileConf.modules[ns][env]) {
                for (var e in this._fileConf.modules[ns][env]) {
                    if (this._values.modules[ns] === undefined) {
                        this._values.modules[ns] = {};
                        if (this._values.modules[ns][e] === undefined) {
                            this._values.modules[ns][e] = {};
                        }
                    }
                    this._values.modules[ns][e] = this._fileConf.modules[ns][env][e];
                }
            }
        }
    }

    module(name) {
        name = name ? name.toLocaleLowerCase() : undefined;
        return name ? (this._values[this._aliases.modules[name]] || this._values.modules[name]) : this._values.modules;
    }

    shared(name) {
        return name ? this._values.shared[name] : this._values.shared;
    }

    env(name) {
        return name ? this._values.env[name] : this._values.env;
    }
}

export default Config;