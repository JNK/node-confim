# Confim
##### A smart configuration management module


## What does it do
This modules allows you to easily manage the configuration of small and big applications with environment variable and multi environment support

## Install
NPM has you covered: ```npm i -S confim```

## Example

Example configuration file ```config.js```
```javascript
module.exports = {
    modules: {
        database: {
            default: {
                port: 1234
            },
            development: {
                host: 'database.dev.internal'
            },
            integration: {
                host: 'database.int.internal'
            },
            production: {
                host: 'database.prod.internal'
            }
        }
    },
    shared: {
        default: {
             loglevel: "info"
            },
            "development": {
              "loglevel": "debug"
            },
            "integration": {
              "loglevel": "error"
            },
            "production": {
              "loglevel": "warn"
            }
    },
    aliases: {
        'primary-server': "web-server-two"
    }
};

  "shared": {
    "*": {
      "loglevel": "info"
    },
    "development": {
      "loglevel": "debug"
    },
    "integration": {
      "loglevel": "error"
    },
    "production": {
      "loglevel": "warn"
    }
  },
  "modules": {
    "web-server-one": {
      "*": {
        "port": 3000,
        "host": "127.0.0.1"
      },
      "development": {
        "host": "0.0.0.0"
      }
    },
    "web-server-two": {
      "*": {
        "port": 4000,
        "host": "127.0.0.1"
      },
      "development": {
        "host": "0.0.0.0"
      }
    },
    "database": {
      "*": {
        "loglevel": "info",
        "username": "foo",
        "database": "bar",
        "password": "___CONFIM___REQUIRED___"
      },
      "development": {
        "host": "localhost",
        "password": "weakPassFoLocal"
      },
      "integration": {
        "host": "db.integration.example.org"
      },
      "production": {
        "host": "db.production.example.org"
      }
    }
  }
}
```

##### What are we defining
- three modules:
    - ```web-server-one```
    - ```web-server-two``` (notice we defined ```loglevel```which overrides the shared property)
    - ```database```
- a shared ```loglevel``` property accessible to every module
- an alias for ```web-server-two``` named ```primary-server```

##### How it works
The ```default``` key in the modules and in the shared key is the default to use for any environment where the key is not defined.
We use a special ```__CONFIM_REQUIRED__``` key in database module. This makes sure that the value is present as environment variable or in a specific environment.
In the example ```password``` is defined in development unlike integration and production. When you do not provide it via ```env DATABASE_password=bla``` and the environment is not development the app will fail as soon as the configuration is read from file

##### Get the data
Create a ```ìndex.js``` file in the same directory or a child directory of the config.js file and paste the following content.
```javascript
// file: index.js

var Confim = require('confim').default; // import confim using es5
//import Confim from 'confim'; // import confim using es6

// Get database config merged with shared and of current environment
var dbConf = Confim('database').conf;
console.log(dbConf);

```

The only thing left to do before you run is install confim: ```npm i -S confim```

Now try running the example: ```node index.js```; When you try to run it in the production environment it will throw an error as the database password is not set: ```env NODE_ENV=production node index.js```; This can be fixed by supplying the variable: ```env NODE_ENV=production DATABASE_password=yay! node index.js```

## Need help?
Just create an issue on GitHub and I will see what I can do...

## Future plans
- Nicer error handling
- Translate keys to multi-level objects