import {Reflect} from '../reflect';

import {ExpresskitServer} from './server';
import {KoaRouter} from '../router';
import {IRoute, Response, ResponseService} from '../route';
import {RuleService} from '../rule/service';
import {InjectorService} from '../injector/service';
import {DTOManager} from '../dto';

export class KoaServer extends ExpresskitServer {

  private routerPackage: any;

  constructor(koa: any, routerPackage: any) {
    super();

    this.package = koa;
    this.application = new koa();
    this.routerPackage = routerPackage;
    
    this.router = this.createRouter('/');
  }

  public createRouter(mount: string): KoaRouter {
    let router = this.routerPackage();

    return new KoaRouter(mount, router);
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
  
  public getHeader(request: any, name: string): string {
    return request.header[name.toLowerCase()];
  }
  
  public getQuery(request: any, name: string): string {
    return request.query[name];
  }
  
  public getParam(request: any, name: string): string {
    return request.params[name];
  }
  
  public getBody(request: any): any {
    return request.request.body;
  }
  
  public getRequestHandler(route: IRoute): Function {
    let self = this;
    
    // koa uses the callback scope
    return function (ctx: any) {
      let rules = Reflect.getMetadata('Rules', route.object, route.key) || [];

      return RuleService.runRules(self, rules, ctx).then(() => {
        return InjectorService.run(self, route.object, route.key, ctx).then((response: Response) => {
          return self.sendResponse(route, ctx, ResponseService.convertSuccessResponse(response));
        }).catch((response: Response) => {
          return self.sendResponse(route, ctx, ResponseService.convertErrorResponse(response));
        });
      }).catch((response: Response) => {
        return self.sendResponse(route, ctx, ResponseService.convertErrorResponse(response));
      });
      
    }
  }
  
  public sendResponse(route: IRoute, ctx: any, response: Response) {
    let object = route.object;
    let key = route.key;

    let responseType = Reflect.getMetadata('ResponseType', object, key);
    if(responseType) {
      DTOManager.scrubOut(response.data, responseType);
    }
    
    ctx.body = response.data;
    ctx.status = response.httpCode; 
  }
  
}