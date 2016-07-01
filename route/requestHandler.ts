import {Reflect} from '../reflect';

import {IRoute} from './manager';
import {ResponseHandlerService} from './responseHandler';
import {ResponseType, Response} from './response';
import {RuleService} from '../rule/service';
import {InjectorService} from '../injector/service';

export interface IRequestHandler {
  (request: any, response: any): void;
}

export class RouteInjectionContext {
  public request: any;
}


export class RequestHandlerService {

  /**
   * @description Returns a route handler
   * @param {IRoute} route [description]
   */
  public static requestHandlerFactory(route: IRoute): IRequestHandler {
    return function (request: any, expressResponse: any) {
      let context = {routeScope: this, request: request};
      
      let rules = Reflect.getMetadata('Rules', route.object, route.key) || [];

      RuleService.runRules(rules, request).then(() => {
        InjectorService.run(route.object, route.key, request).then((response: Response) => {
          return ResponseHandlerService.handleResponse(route, expressResponse, response)
        }).catch((response: Response) => {
          return ResponseHandlerService.handleResponse(route, expressResponse, ResponseHandlerService.convertErrorResponse(response));
        });
      }).catch((response: Response) => {
        return ResponseHandlerService.handleResponse(route, expressResponse, ResponseHandlerService.convertErrorResponse(response));
      });
      
    }
  }

}