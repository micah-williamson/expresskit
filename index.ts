declare var require: any;

import RouteManager from './route/manager';

var express = require('express');

export interface IExpressKitConfig {
  port: number;
}

export default class ExpressKit {

  public static server = express();

  public static start(config: IExpressKitConfig) {
    RouteManager.bindRoutes(this.server);

    this.server.listen(config.port, () => {
      console.log(`Started server on port ${config.port}`);
    });
  }
}