node-collective-oauth-server
----

Simple OAuth2.0 server for communicating with the [Widen Media Collective's](http://widen.com) REST API.

[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)[![collective-oauth-server](http://img.shields.io/npm/v/collective-oauth-server.svg?style=flat-square)](https://www.npmjs.com/package/collective-oauth-server)

# Installing

## Local

This works best when `node-collective-oauth-server` is a dependency of your project:

```
npm install --save collective-oauth-server
```

## Global

This works best when you just want to try `node-collective-oauth-server`, or get a simple OAuth2 server for Collective started ASAP.


# Executing

# Local

Then you can:

Programatically:

*a)*
```
var collective_server = require('collective-oauth-server').server;
var server = collective_server(opts);
server.listen();
```

*b)*

From command line:

```
./node_modules/.bin/collective-oauth-server
```

*c)*

In `package.son`:

```
"scripts": {
    "start": "collective-auth-server"
}
```

# Global

```
npm install -g collective-auth-server
```

Then you can, from command-line:

From command line:

```
collective-oauth-server
```

# Usage

```
usage: collective-instant [OPTIONS]
options:
    --host=ARG, --hostname=ARG          The the local host to run as (default:
                                        localhost). Environment: HOSTNAME=ARG
    -p NUM, --port=NUM                  The local port to run as (default: 80).
                                        Environment: PORT=NUM
    --collective-protocol=ARG           The Widen Collective protocol (default:
                                        https). Environment:
                                        COLLECTIVE_PROTOCOL=ARG
    --collective-host=ARG               The Widen Collective host (default:
                                        demo.widencollective.com). Environment: COLLECTIVE_HOST=ARG
    --collective-port=NUM               The Widen Collective port (default: 80).
                                        Environment: COLLECTIVE_PORT=NUM
    --username=ARG, --client-id=ARG, --collective-client-id=ARG
                                        OAuth client id. Suggested to use
                                        environment variables instead.
                                        Environment:     --username=ARG, --client-id=ARG, --collective-client-id=ARG
                                        OAuth client id. Suggested to use
                                        environment variables instead.
                                        Environment: COLLECTIVE_CLIENT_ID=ARG
    --password=ARG, --client-secret=ARG, --collective-client-secret=ARG
                                        OAuth client secret. Suggested to use
                                        environment variables instead.
                                        Environment:
                                            --password=ARG, --client-secret=ARG, --collective-client-secret=ARG
                                        OAuth client secret. Suggested to use
                                        environment variables instead.
                                        Environment:
                                        COLLECTIVE_CLIENT_SECRET=ARG
    --static=ARG                        Path to host static files from (default:
                                        ./static). Environment:
                                        COLLECTIVE_STATIC=ARG
    -v, --verbose                       Verbose output. Use multiple times for
                                        more verbose.
    --version                           Print version and exit.
    -h, --help               
```                