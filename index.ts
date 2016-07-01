declare var require: any;
declare var process: any;

import {RouteManager} from './route/manager';
import {ExpressServer} from './server/express';
import {IStaticUriPath} from './route/static';
import {fatal} from './error';

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
  middleware?: any[];
}

export default class Expresskit {

  public static server: any;

  public static initDefaultExpresskitConfig(config: IExpresskitConfig) {
    config.port = config.port || 8000;
    config.compression = !!config.compression;
    config.timezone = config.timezone || 'Z';
    config.staticFiles = config.staticFiles || [];
    config.staticPaths = config.staticPaths || [];
    
    this.server = config.server || new ExpressServer(express);

    // TODO: legacy hack
    if(this.server instanceof ExpressServer) {
      config.middleware = config.middleware || [
        bodyParser.json({ type: 'application/json' }),
        bodyParser.urlencoded({extended: true}),
        bodyParser.text(),
        bodyParser.raw()
      ];
    } else {
      config.middleware = config.middleware || [];
    }
    
  }

  /**
   * Starts an application instance
   */
  public static start(config: IExpresskitConfig = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.initDefaultExpresskitConfig(config);
      
      process.env.TZ = config.timezone;

      config.middleware.forEach((middleware) => {
        this.server.use(middleware);
      });  

      if(config.compression) {
        this.server.use(compression());
      }

      RouteManager.bindStaticPaths(this.server, config.staticPaths);
      RouteManager.bindStaticFiles(this.server, config.staticFiles);
      RouteManager.bindRoutes(this.server);

      this.server.listen(config.port, () => {
        console.log(`Started server on port ${config.port}`);
        resolve();
      })
    }).catch((err: any) => {
      fatal(err);
    });
  }

  /**
   * Closes the application instance
   */
  public static stop() {
    console.log('closed application');
    this.server.close();
  }
}