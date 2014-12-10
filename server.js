#!/usr/bin/env node
'use strict';

var assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    url = require('url'),
    util = require('util'),
    qs = require('querystring');

var uuid = require('uuid'),
    bole = require('bole'),
    pretty = require('bistre')();

module.exports = function createServer(opts) {
    var log = bole('collective-instant');

    bole.output({
        level: 'debug',
        stream: pretty
    });

    pretty.pipe(process.stdout);

    var hostname = opts.hostname,
        port = opts.port,
        collective_protocol = opts.collective_protocol,
        collective_host= opts.collective_host,
        collective_port = opts.collective_port,
        client_id = opts.client_id,
        client_secret = opts.client_secret;

    assert(hostname && hostname.length > 0, 'Hostname must be present.');
    assert(port && port > 0, 'Port must be present.');
    assert(collective_protocol && collective_protocol.length > 0,
           'Collective protocol must be present.');
    assert(collective_host && collective_host.length > 0,
           'Collective host must be present.');
    assert(opts.collective_port && collective_port > 0,
           'Collective port must be present.');
    assert(client_id && client_id.length > 0,
           'Client id must be present.');
    assert(client_secret && client_secret.length > 0,
           'Client secret must be present.');

    if (opts.static) {
        var st = require('st');
        var mount = st({
            path: path.resolve(opts.static),
        });
    }

    var collective = require('media-collective');
    var collective_options = {
        protocol: collective_protocol,
        host: collective_host,
        port: collective_port,
        auth: {
            type: 'basic',
            username: client_id,
            password: client_secret
        }
    };

    var server = http.createServer(function(req, res){

        function respond(code, err) {
            res.statusCode = code;
            res.end(err + '\n');
        }

/* thanks:
* http://stackoverflow.com/questions/
* 3393854/get-and-set-a-single-cookie-with-node-js-http-server */
        function parseCookies (request) {
            var list = {},
                rc = request.headers.cookie;

            if (rc) {
                rc.split(';').forEach(function( cookie ) {
                    var parts = cookie.split('=');
                    var index = parts.shift().trim();
                    list[index] = decodeURIComponent(parts.join('='));
                });
            }

            return list;
        }

        var cookies = parseCookies(req);

        var u = url.parse(req.url);
        if (u.pathname.match(/^\/callback\/?$/)) {
            log.info(req);
            var m = req.method;

            try {
                var parts = decodeURIComponent(u.pathname)
                            .split('/')
                            .slice(1); }
            catch (err) {
                return respond(400, err);
            }
            var params = qs.parse(u.query);

            // upgrade the code to an access token
            log.info('Received Collective OAuth2 callback.', params);

            collective.json('POST', '/oauth/token', {
                authorization_code: params.code,
                grant_type: 'authorization_code'
            }, collective_options, function(err, data){
                if (err) {
                    log.error(err);
                    res.writeHead(500);
                    res.end(err + '');
                    return;
                }

                log.info('Setting user Collective \'token\' cookie.');

                res.writeHead(302, {
                    Location: '/',
                    'Set-Cookie': util.format('access_token=%s',
                                              data.body.access_token)
                });
                res.end(data.body.access_token + '\n');
                return;
            });
        }
        else if (u.pathname.match(/^\/revoke\/?$/)) {
            log.info(req);
            res.statusCode = 302;
            res.setHeader('Set-Cookie', 'access_token=');
            res.end();
            return;
        }
        else {
            log.info(req);
            if (!cookies.access_token) {
                log.info('Attempting to authorize via Collective.');
                var query = qs.stringify({
                    client_id: client_id,
                    redirect_uri: util.format('http://%s:%d/callback',
                                              hostname, port),
                    state: uuid.v1(),
                    response_type: 'code'
                });
                res.writeHead(303, {
                    Location: 'http://localhost:8080/allowaccess?' + query
                });
                res.end();
                return;
            }

            req.url = req.url.replace(/^\/\-\//, '/');
            mount(req, res);
            return;
        }

        return;

    });

    server.on('listening', function () {
        log.info(util.format('listening on http://%s:%d', hostname, port));
    });

    return server;

};
