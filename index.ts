declare var require: any;

import RouteManager from './route/manager';
import {IStaticUriPath} from './route/static';

var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

export interface IExpressKitConfig {
  port?: number;
  compression?: boolean;
  timezone?: string;
  staticFiles?: IStaticUriPath[];
  staticPaths?: IStaticUriPath[];
}

function initDefaultExpressKitConfig(config: IExpressKitConfig) {
  config.port = config.port || 8000;
  config.compression = !!config.compression;
  config.timezone = config.timezone || 'Z';
  config.staticFiles = config.staticFiles || [];
  config.staticPaths = config.staticPaths || [];
}

export default class ExpressKit {

  public static server = express();

  public static start(config: IExpressKitConfig = {}) {
    process.env.TZ = config.timezone;
    
    this.server.use(bodyParser.json({ type: 'application/json' }));
    this.server.use(bodyParser.urlencoded({extended: true}));
    this.server.use(bodyParser.text());
    this.server.use(bodyParser.raw());
    
    if(config.compression) {
      this.server.use(compression());
    }

    RouteManager.bindStaticPaths(this.server, config.staticPaths);
    RouteManager.bindStaticFiles(this.server, config.staticFiles);
    RouteManager.bindRoutes(this.server);

    this.server.listen(config.port, () => {
      console.log(`Started server on port ${config.port}`);
    });
  }
}