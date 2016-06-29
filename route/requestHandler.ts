import {Reflect} from '../reflect';
import {Request as ExpressRequest, Response as ExpressResponse} from 'express';

import {IRoute} from './manager';
import {ResponseHandlerService} from './responseHandler';
import {ResponseType, Response} from './response';
import {RuleService} from '../rule/service';
import {InjectorService} from '../injector/service';

export interface IRequestHandler {
  (request: any, response: any): void;
}

export class RouteInjectionContext {
  public request: ExpressRequest;
}


export class RequestHandlerService {

  /**
   * @description Returns a route handler
   * @param {IRoute} route [description]
   */
  public static requestHandlerFactory(route: IRoute): IRequestHandler {
    return (request: ExpressRequest, expressResponse: ExpressResponse) => {

      let rules = Reflect.getMetadata('Rules', route.object, route.key) || [];
    
      RuleService.runRules(rules, request).then(() => {
        InjectorService.run(route.object, route.key, request).then((response: Response) => {
          ResponseHandlerService.handleResponse(route, expressResponse, response);
        }).catch((response: Response) => {
          ResponseHandlerService.handleResponse(route, expressResponse, ResponseHandlerService.convertErrorResponse(response));
        });
      }).catch((response: Response) => {
        ResponseHandlerService.handleResponse(route, expressResponse, ResponseHandlerService.convertErrorResponse(response));
      });
      
    }
  }

}