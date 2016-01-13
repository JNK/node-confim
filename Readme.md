# Confim

## What does it do?
Confim lets you easily manage multi-environment and multi-module configuration within a project.

## Functionality

Confim picks the values after the following patterns:
- an environment variable will override a config file variable (shared or module based)

## Example
Create an ```index.js``` file and add the following content:
```javascript
// File: index.js

import Confim from 'confim';
let options = {path: 'config.json, defaultEnvironment: 'production'}; // options can also be a string of the config file path; defaultEnvironemnt is 'development' by default and thus optional.
let confim = new Confim(options);

console.log(confim.module('foo));

console.log(confim.shared('shared-foo));

console.log(confim.env('env-foo'));

```

Next create a ```config.json``` file in the same path as the ```index.js``` file and add the following content:
```json
{
    "aliases": {
        "bar": "foo"
    },
    "shared": {
        "*": {
            "shared-foo": 123,
        }
        "development": {
            "super-foo": 456
        },
        "production": {
            "super-foo": 789
        }
    },
    "modules": {
        "foo": {
            "*": {
                "description": "load this as a default value"
            },
            "production": {
                "description": "override description if NODE_ENV=production"
            }
        }
    }
}

```