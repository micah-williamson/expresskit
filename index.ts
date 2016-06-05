declare var require: any;
declare var process: any;

import DecoratorManager from './decorator/manager';
import {IStaticUriPath} from './route/definition';
import {Application} from 'express';

var express: () => Application = require('express');
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

  public static server: Application = express();
  
  public static decoratorManager = DecoratorManager;
  
  public static config: IExpressKitConfig;

  public static start(config?: IExpressKitConfig ) {
    // TODO: es6 node does not support defaults in the arguments.
    //       Once this becomes available use `= {}` as the default value
    this.config = config || {}
    
    initDefaultExpressKitConfig(config);
    
    process.env.TZ = config.timezone;
    
    // Before app start
    for(let serviceName in DecoratorManager.decoratorDefinitionServices) {
      let service = DecoratorManager.decoratorDefinitionServices[serviceName];
      service.onBeforeAppStart();
    }

    this.server.listen(config.port, () => {
      console.log(`Started server on port ${config.port}`);
      
      // After app start
      for(let serviceName in DecoratorManager.decoratorDefinitionServices) {
        let service = DecoratorManager.decoratorDefinitionServices[serviceName];
        service.onAfterAppStart();
      }
    });
  }
}