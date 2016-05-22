declare var require: any;

import RouteManager from './route/manager';

var express = require('express');
var bodyParser = require('body-parser')

export interface IExpressKitConfig {
  port: number;
}

export default class ExpressKit {

  public static server = express();

  public static start(config: IExpressKitConfig) {
    this.server.use(bodyParser.json({ type: 'application/json' }));
    this.server.use(bodyParser.urlencoded({extended: true}));
    this.server.use(bodyParser.text());
    this.server.use(bodyParser.raw());

    RouteManager.bindRoutes(this.server);

    this.server.listen(config.port, () => {
      console.log(`Started server on port ${config.port}`);
    });
  }
}