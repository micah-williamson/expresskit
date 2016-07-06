declare var require: any;

let express = require('express');

import {Reflect} from 'restkit/reflect';
import {RestkitServer} from 'restkit/server';
import {RestkitRouter} from 'restkit/router';
import {IRoute} from 'restkit/route';
import {Response} from 'restkit/response';
import {RouteManager} from 'restkit/route';

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
      RouteManager.runRoute(route, ctx).then((response: Response) => {
        this.sendResponse(route, expressResponse, response);
      });
    }
  }
  
  public sendResponse(route: IRoute, expressResponse: any, response: Response) {
    expressResponse.status(response.httpCode).send(response.data);
  }
}