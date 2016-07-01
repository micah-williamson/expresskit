declare var require: any;

import {ExpresskitServer} from './server';
import {KoaRouter} from '../router';
import {fatal} from '../error';
import {Response} from '../route';

export class KoaServer extends ExpresskitServer {

  private routerPackage: any;

  constructor(koa: any, routerPackage: any) {
    super();

    this.package = koa;
    this.application = new koa();
    this.routerPackage = routerPackage;
    
    this.expresskitRouter = this.Router('/');
  }

  public Router(mount: string): KoaRouter {
    let router = this.routerPackage({
      path: mount,
      prefix: mount
    });

    return new KoaRouter(mount, router);
  }

  public use(... args: any[]) {
    if(this.expresskitRouter) {
      return this.expresskitRouter.router.use.apply(this.expresskitRouter.router, args);  
    } else {
      return this.application.use.apply(this.application, args);
    }
  }

  public listen (... args: any[]) {
    return this.listenHandle = this.application.listen.apply(this.application, args);
  }

  public stop(... args: any[]) {
    return this.listenHandle.stop.apply(this.application, args);
  }

  public static (... args: any[]) {
    return this.expresskitRouter.router.static.apply(this.expresskitRouter.router, args);
  }

  public get (... args: any[]) {
    console.log('vvvv');
    return this.expresskitRouter.router.get.apply(this.expresskitRouter.router, args);    
  }
  
  public put (... args: any[]) {
    return this.expresskitRouter.router.put.apply(this.expresskitRouter.router, args);
  }

  public post (... args: any[]) {
    return this.expresskitRouter.router.post.apply(this.expresskitRouter.router, args);
  }

  public delete (... args: any[]) {
    return this.expresskitRouter.router.delete.apply(this.expresskitRouter.router, args);
  }

  public sendResponse(route: any, response: Response) {
    route.body = response.data;
    route.status = response.httpCode;
  }
}