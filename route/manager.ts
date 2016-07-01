declare var require: any;
declare var __dirname: any;

import {Reflect} from '../reflect';

import {IStaticUriPath} from './static';
import {RequestHandlerService} from './requestHandler';
import {ExpresskitServer} from '../server';
import {AuthManager} from '../auth/manager';
import {ExpresskitRouter} from '../router';
import {fatal} from '../error';

var path = require('path');

export type RouteMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface IRouter {
  mount: string;
  object: any;
  expresskitRouter: ExpresskitRouter;
}

export interface IRoute {
  method: RouteMethod;
  path: string;
  object: any;
  key: string;
};

export class RouteManager {
  public static routers: IRouter[] = [];

  public static routes: IRoute[] = [];

  /**
   * Registers a router with the route manager. Has no function other than handling middleware
   */
  public static registerRouter(object: any, mount: string) {
    this.routers.push({
      mount: mount,
      object: object,
      expresskitRouter: null
    });
  }

  /**
   * Registers a route to RouteManager.routes
   * @param {RouteMethod} method [description]
   * @param {string}      path   [description]
   * @param {Object}      object [description]
   * @param {string}      key    [description]
   */
  public static registerRoute(method: RouteMethod, path: string, object: any, key: string) {
    if(object.hasOwnProperty(key)) {
      let existingRoute = this.getRoute(method, path);
      if(!existingRoute) {
        this.routes.push({
          method: method,
          path: path,
          object: object,
          key: key
        });
      } else {
        let error = `Unable to register route: ${method} > ${path} to ${object.prototype.constructor.name}.${key}. This path is already registered to ${existingRoute.object.prototype.constructor.name}.${key}`;
        fatal(new Error(error));
      }
    } else {
      let error = `Unable to register route: ${method} > ${path} to ${object.prototype.constructor.name}.${key}. ${key} does not exist on ${object.prototype.constructor.name}. Instead of calling RouteManager.registerRoute directly, use the @Route decorator.`;
      fatal(new Error(error));
    }
  }

  /**
   * Binds the routes to the given express application
   * @param {any} application [description]
   */
  public static bindRoutes(server: ExpresskitServer) {
    // Initialize routers
    this.routers.forEach((router) => {
      let routerMiddleware = Reflect.getMetadata('Middlewares', router.object) || [];
      let expresskitRouter = router.expresskitRouter;

      if(!expresskitRouter) {
        expresskitRouter = router.expresskitRouter = server.Router(router.mount);
      }

      routerMiddleware.forEach((middleware: Function) => {
        expresskitRouter.router.use(middleware);
      });
    });

    // Bind routes
    this.routes.forEach(route => {
      console.log(`[DEBUG] Bound route: ${route.method} > ${route.path} to ${route.object.prototype.constructor.name}.${route.key}.`);

      let routerBinding = this.getRouterByClass(route.object);
      let expresskitRouter: any;

      if(routerBinding) {
        expresskitRouter = routerBinding.expresskitRouter;
      } else {
        expresskitRouter = server.expresskitRouter;
      }

      // Binding route middlewares
      let routeMiddleware = Reflect.getMetadata('Middlewares', route.object, route.key) || [];
      routeMiddleware.forEach((middleware: Function) => {
        expresskitRouter.router.use(route.path, middleware);
      });

      let expressMethod = this.getExpressMethod(expresskitRouter.router, route.method);
      expressMethod.call(expresskitRouter.router, route.path, RequestHandlerService.requestHandlerFactory(route));
    });

    // Bind routers
    this.routers.forEach((router) => {
      router.expresskitRouter.bindToApplication(server.expresskitRouter.router);
      //server.use.apply(server, router.expresskitRouter.getBindableArguments());
    });

    // Bind default router
    server.expresskitRouter.bindToApplication(server.application);
    //server.application.use.apply(server.application, server.expresskitRouter.getBindableArguments());
  }
  
  /**
   * Given the static paths, uses express.static to bind static paths
   */
  public static bindStaticPaths(server: ExpresskitServer, staticPaths: IStaticUriPath[]) {
    staticPaths.forEach((path) => {
      server.use(path.uri, server.static(path.path));
    });
  }
  
  /**
   * Given the static paths, uses express.static to bind static paths
   */
  public static bindStaticFiles(server: ExpresskitServer, staticPaths: IStaticUriPath[]) {
    staticPaths.forEach((p) => {
      server.get(p.uri, (req: any, res: any) => {
        res.sendFile(path.resolve(__dirname + '/' + p.path));
      });
    });
  }

  /**
   * Gets the route registered to [method] => path
   * @param {RouteMethod} method [description]
   * @param {string}      path   [description]
   */
  public static getRoute(method: RouteMethod, path: string) {
    let route: IRoute = null;

    this.routes.forEach((rt) => {
      if(rt.method === method && rt.path === path) {
        route = rt;
      }
    });

    return route;
  }

  /**
   * Gets the router by the object given. If the router doesn't exist, returns null
   */
  public static getRouterByClass(object: any) {
    for(var i = 0; i < this.routers.length; i++) {
      if(this.routers[i].object === object) {
        return this.routers[i];
      }
    }

    return null;
  }

  /**
   * Gets the route registered to [object].[method]
   * @param {any}    object [description]
   * @param {string} method [description]
   */
  public static getRouteByClass(object: any, method: string) {
    let route: IRoute = null;

    this.routes.forEach((rt) => {
      if(rt.object === object && rt.key === method) {
        route = rt;
      }
    });

    return route;
  }

  /**
   * Given a RouteMethod, returns the express application method
   * @param  {RouteMethod} method [description]
   * @return {any}                [description]
   */
  private static getExpressMethod(application: any, method: RouteMethod): any {
    switch(method) {
      case 'GET':
        return application.get;
      case 'PUT':
        return application.put;
      case 'POST':
        return application.post;
      case 'DELETE':
        return application.delete;
    }

    return;
  }
}