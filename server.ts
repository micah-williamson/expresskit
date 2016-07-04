declare var require: any;

let express = require('express');

import {Reflect} from 'restkit/reflect';
import {RestkitServer} from 'restkit/server';
import {RestkitRouter} from 'restkit/router';
import {IRoute, Response, ResponseService} from 'restkit/route';
import {RuleService} from 'restkit/rule';
import {InjectorService} from 'restkit/injector';
import {DTOManager} from 'restkit/dto';

import {ExpressRouter} from './router';

export class ExpressServer extends RestkitServer {
  constructor() {
    super();

    this.package = express;
    this.application = express();
    this.baseRouter = this.createRouter('/');
  }

  public createRouter(mount: string): RestkitRouter {
    let router = this.package.Router();

    return new ExpressRouter(mount, router);
  }

  public use(... args: any[]) {
    return this.application.use.apply(this.application, args);
  }

  public listen (... args: any[]) {
    return this.listenHandle = this.application.listen.apply(this.application, args);
  }

  public stop(... args: any[]) {
    return this.listenHandle.stop.apply(this.application, args);
  }
  
  public getRequestHandler(route: IRoute): Function {
    return (ctx: any, expressResponse: any) => {
      let rules = Reflect.getMetadata('Rules', route.object, route.key) || [];

      return RuleService.runRules(rules, ctx).then(() => {
        return InjectorService.run(route.object, route.key, ctx).then((response: Response) => {
          return this.sendResponse(route, expressResponse, ResponseService.convertSuccessResponse(response));
        }).catch((response: Response) => {
          return this.sendResponse(route, expressResponse, ResponseService.convertErrorResponse(response));
        });
      }).catch((response: Response) => {
        return this.sendResponse(route, expressResponse, ResponseService.convertErrorResponse(response));
      });
    }
  }
  
  public sendResponse(route: IRoute, expressResponse: any, response: Response) {
    let object = route.object;
    let key = route.key;

    let responseType = Reflect.getMetadata('ResponseType', object, key);
    if(responseType) {
      DTOManager.scrubOut(response.data, responseType);
    }
    
    expressResponse.status(response.httpCode).send(response.data);
  }
}