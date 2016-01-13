/**
 * Created by jnk on 13.01.16.
 */

class Config {
    constructor(configFilePath) {
        this._path = configFilePath;

        this._values = {};
        this._values._env = {};
        this._values['*'] = {};
        this._aliases = {};

        this._loadConfig();
    }

    _loadConfig() {
        this._fileConf = require(this._path);
        this._aliases = this._fileConf._aliases || {};
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
                if (this._values['_env'][e] === undefined) {
                    this._values['_env'][e] = {};
                }
                this._values['_env'][e] = process.env[e];
            }
        }

        this._loadFile();
    }

    _loadFile() {
        let env = process.env.NODE_ENV || 'development';

        if (this._fileConf['*']) {
            if (this._fileConf['*']['*']) {
                for (var e in this._fileConf['*']['*']) {
                    if (this._values['*'][e] === undefined) {
                        this._values['*'][e] = {};
                    }
                    this._values['*'][e] = this._fileConf['*']['*'][e];
                }
            }
            if (this._fileConf['*'][env]) {
                for (var e in this._fileConf['*'][env]) {
                    if (this._values['*'][e] === undefined) {
                        this._values['*'][e] = {};
                    }
                    this._values['*'][e] = this._fileConf['*'][env][e];
                }
            }
        }

        for (var ns in this._fileConf.namespaces || {}) {
            if (this._fileConf.namespaces[ns]['*']) {
                for (var e in this._fileConf.namespaces[ns]['*']) {
                    if (this._values[ns] === undefined) {
                        this._values[ns] = {};
                        if (this._values[ns][e] === undefined) {
                            this._values[ns][e] = {};
                        }
                    }
                    this._values[ns][e] = this._fileConf.namespaces[ns]['*'][e];
                }
            }
            if (this._fileConf.namespaces[ns][env]) {
                for (var e in this._fileConf.namespaces[ns][env]) {
                    if (this._values[ns] === undefined) {
                        this._values[ns] = {};
                        if (this._values[ns][e] === undefined) {
                            this._values[ns][e] = {};
                        }
                    }
                    this._values[ns][e] = this._fileConf.namespaces[ns][env][e];
                }
            }
        }
        this._env = this._values._env;
    }

    moduleNames() {
        return Object.keys(this._fileConf.namespaces || {});
    }

    module(name) {
        name = name ? name.toLocaleLowerCase() : undefined;
        return name ? (this._values[this._aliases[name]] || this._values[name]) : undefined;
    }

    shared() {
        return this._values['*'];
    }

    env(name) {
        return name ? this._values._env[name] : this._values._env;
    }
}

export default Config;