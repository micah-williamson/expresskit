import {Reflect} from '../reflect';

import {ExpresskitServer} from './server';
import {ExpressRouter} from '../router';
import {IRoute, Response, ResponseService} from '../route';
import {RuleService} from '../rule/service';
import {InjectorService} from '../injector/service';
import {DTOManager} from '../dto';

export class ExpressServer extends ExpresskitServer {
  constructor(express: any) {
    super();

    this.package = express;
    this.application = express();
    this.router = this.createRouter('/');
  }

  public createRouter(mount: string): ExpressRouter {
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
  
  public getHeader(request: any, name: string): string {
    return request.header(name);
  }
  
  public getQuery(request: any, name: string): string {
    return request.query[name];
  }
  
  public getParam(request: any, name: string): string {
    return request.params[name];
  }
  
  public getBody(request: any): any {
    return request.body;
  }
  
  public getRequestHandler(route: IRoute): Function {
    return (ctx: any, expressResponse: any) => {
      let rules = Reflect.getMetadata('Rules', route.object, route.key) || [];

      return RuleService.runRules(this, rules, ctx).then(() => {
        return InjectorService.run(this, route.object, route.key, ctx).then((response: Response) => {
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