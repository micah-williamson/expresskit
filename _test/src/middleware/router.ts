import {Router, Route} from 'restkit/route';
import {Auth, AuthHandler} from 'restkit/auth';
import {ScrubOut, ScrubIn, Validate, ResponseType} from 'restkit/dto';
import {RouterMiddleware, RouteMiddleware} from 'restkit/middleware';

import {Param, Header, Body} from '../../../injectables';

let middlewareValue = '';

export class MiddlewareService {
  public static routerMiddleware(ctx: any, koaNext: any, expressNext: any) {
    middlewareValue = 'router';

    if(expressNext) {
      expressNext();
    } else if(koaNext) {
      return koaNext();
    }
  }

  public static routeMiddleware(ctx: any, koaNext: any, expressNext: any) {
    middlewareValue = 'route';

    if(expressNext) {
      expressNext();
    } else if(koaNext) {
      return koaNext();
    }
  }
}

@Router('/middleware')
@RouterMiddleware(MiddlewareService.routerMiddleware)
export class MiddlewareRouter {
    @Route('GET', '/router')
    public static routerMiddleware() {
      return middlewareValue;
    }

    @Route('GET', '/route')
    @RouteMiddleware(MiddlewareService.routeMiddleware)
    public static routeMiddleware() {
      return middlewareValue;
    }
}