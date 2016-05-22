"use strict";
const manager_1 = require('./route/manager');
var express = require('express');
var bodyParser = require('body-parser');
class ExpressKit {
    static start(config) {
        this.server.use(bodyParser.json({ type: 'application/json' }));
        this.server.use(bodyParser.urlencoded({ extended: true }));
        this.server.use(bodyParser.text());
        this.server.use(bodyParser.raw());
        manager_1.default.bindRoutes(this.server);
        this.server.listen(config.port, () => {
            console.log(`Started server on port ${config.port}`);
        });
    }
}
ExpressKit.server = express();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExpressKit;
