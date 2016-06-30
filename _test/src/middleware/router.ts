import {Request as ExpressRequest} from 'express';

import {Router, Route} from '../../../route';
import {Param, Header, Body} from '../../../property';
import {Auth, AuthHandler} from '../../../auth';
import {ScrubOut, ScrubIn, Validate, ResponseType} from '../../../dto';
import {RouterMiddleware, RouteMiddleware} from '../../../middleware';

export class MiddlewareService {
  public static routerMiddleware(req: ExpressRequest, res: any, next: any) {
    req.body.pass = 'router';
    next();
  }

  public static routeMiddleware(req: ExpressRequest, res: any, next: any) {
    req.body.pass = 'route';
    next();
  }
}

@Router('/middleware')
@RouterMiddleware(MiddlewareService.routerMiddleware)
export class MiddlewareRouter {
    @Route('GET', '/router/:pass')
    public static routerMiddleware(@Body() body: any) {
      return body.pass;
    }

    @Route('GET', '/route/:pass')
    @RouteMiddleware(MiddlewareService.routeMiddleware)
    public static routeMiddleware(@Body() body: any) {
      return body.pass;
    }
}