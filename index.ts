declare var require: any;
declare var process: any;

import {RouteManager} from './route/manager';
import {IStaticUriPath} from './route/static';

var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

export interface IExpresskitConfig {
  port?: number;
  compression?: boolean;
  timezone?: string;
  staticFiles?: IStaticUriPath[];
  staticPaths?: IStaticUriPath[];
  server?: any;
}

function initDefaultExpresskitConfig(config: IExpresskitConfig) {
  config.port = config.port || 8000;
  config.compression = !!config.compression;
  config.timezone = config.timezone || 'Z';
  config.staticFiles = config.staticFiles || [];
  config.staticPaths = config.staticPaths || [];
}

export default class Expresskit {

  public static server: any;

  public static application: any;

  public static applicationHandle: any;

  /**
   * Starts an application instance
   */
  public static start(config: IExpresskitConfig = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      initDefaultExpresskitConfig(config);
      
      process.env.TZ = config.timezone;

      if(config.server) {
        this.server = config.server;
        this.application = config.server();
      } else {
        this.server = express;
        this.application = express();
      }
      
      this.application.use(bodyParser.json({ type: 'application/json' }));
      this.application.use(bodyParser.urlencoded({extended: true}));
      this.application.use(bodyParser.text());
      this.application.use(bodyParser.raw());
      
      if(config.compression) {
        this.application.use(compression());
      }

      RouteManager.bindStaticPaths(this.server, this.application, config.staticPaths);
      RouteManager.bindStaticFiles(this.application, config.staticFiles);
      RouteManager.bindRoutes(this.server, this.application);

      this.applicationHandle = this.application.listen(config.port, () => {
        console.log(`Started server on port ${config.port}`);
        resolve();
      });
    });
  }

  /**
   * Closes the application instance
   */
  public static stop() {
    console.log('closed application');
    this.applicationHandle.close();
  }
}