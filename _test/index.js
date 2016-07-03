var Expresskit = require('./bld/index').default;
var koa = require('koa');
var koaRouter = require('koa-router');
var KoaServer = require('./bld/server/koa').KoaServer;
var bodyParser = require('koa-bodyparser');

require('./bld/_test/src/basic/router');
require('./bld/_test/src/auth/router');
require('./bld/_test/src/user/router');
require('./bld/_test/src/rules/router');
require('./bld/_test/src/middleware/router');

Expresskit.start({
  server: new KoaServer(koa, koaRouter),
  middleware: [
    bodyParser()
  ]
});

//Expresskit.start();

// tests:
require('./basicRouting.test.js');
require('./auth.test.js');
require('./dto.test.js');
require('./rules.test.js');
require('./middleware.test.js');