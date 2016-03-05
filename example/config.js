/**
 * Created by jnk on 05.03.16.
 */

module.exports = {
    modules: {
        'web-server-one': {
            default: {
                port: 3000,
                host: '127.0.0.1'
            },
            development: {
                host: '0.0.0.0'
            }
        },
        'web-server-two': {
            default: {
                port: 4000,
                host: '127.0.0.1'
            },
            development: {
                host: '0.0.0.0'
            }
        },
        'database': {
            default: {
                logLevel: 'info',
                username: 'foo',
                database: 'bar',
                password: '__CONFIM_REQUIRED__'
            },
            development: {
                host: 'localhost',
                password: 'weakPassFoLocal'
            },
            integration: {
                host: 'db.integration.example.org'
            },
            production: {
                host: 'db.production.example.org'
            }
        }
    },
    shared: {
        default: {
            logLevel: 'info'
        },
        development: {
            logLevel: 'debug'
        },
        integration: {
            logLevel: 'error'
        },
        production: {
            logLevel: 'warn'
        }
    },
    aliases: {
        'primary-server': 'web-server-two'
    }
};