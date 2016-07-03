import {Router, Route} from '../../../route';
import {Param, Header, Body} from '../../../property';
import {Auth, AuthHandler} from '../../../auth';
import {ScrubOut, ScrubIn, Validate, ResponseType} from '../../../dto';
import {RouterMiddleware, RouteMiddleware} from '../../../middleware';

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