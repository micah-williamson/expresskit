import {IRoute} from './manager';
import PropertyManager from '../property/manager';
import {IAuthorizationRule, default as AuthorizationManager} from '../authorization/manager';
import {ResponseType, Response, default as ResponseHandler} from './responseHandler';
import RequestConfig from '../request';

export interface IRequestHandler {
  (request: any, response: any): void;
}

export default class RequestHandlerService {

  /**
   * @description Returns a generic request config given the request
   * @param {any} request [description]
   */
  public static generateRequestConfig(request: any) {
    let config = new RequestConfig();

    config.request = request;
    config.url = request.path;
    config.params = request.params;
    config.query = request.query;

    return config;
  }

  /**
   * @description Returns a route handler
   * @param {IRoute} route [description]
   */
  public static requestHandlerFactory(route: IRoute): IRequestHandler {
    return (request: any, expressResponse: any) => {
      let config = this.generateRequestConfig(request);
      let authorization = AuthorizationManager.getRule(route.object, route.key);
      
      if(authorization) {
        this.verifyAuthorization(authorization, config).then(() => {
          this.runMethod(route, config, expressResponse);
        }).catch((response) => {
          ResponseHandler.handleResponse(route, expressResponse, response);
        });
      } else {
        this.runMethod(route, config, expressResponse);
      }
    }
  }
  
  /**
   * Verifies at least one authorization role is valid
   */
  private static verifyAuthorization(authorization: IAuthorizationRule, config: RequestConfig): Promise<Response> {
    return new Promise((resolve, reject) => {
      let name = authorization.name;
      let roles = authorization.roles;
      let promises: Promise<Response>[] = [];
      let index = 0;
      
      return this.verifyNextAuthorizationRole(name, roles, index, config).then(() => {
        return true;
      }).catch(() => {
        return new Response(403, 'Not Authorized');
      }); 
    });
  }
  
  /**
   * Given the name, the roles, and the index. Continues to try to authorize the request
   * until one authorization role is satisfied or there are no more roles to try.
   */
  private static verifyNextAuthorizationRole(name: string, roles: string[], index: number, config: RequestConfig) {
    return new Promise((resolve, reject) => {
      if(roles[index]) {
        let resource = AuthorizationManager.getResourceByNameAndRole(name, roles[index]);
        let properties = PropertyManager.getProperties(resource.object, resource.method);
        let rolePromise = PropertyManager.getPropertyValues(properties, config).then((response: Response) => {
          if(response.type === ResponseType.Success) {
            resource.object[resource.method].apply(resource.object, response.data).then(() => {
              resolve();
            }).catch(() => {
              resolve(this.verifyNextAuthorizationRole(name, roles, index++, config));
            });
          } else {
            resolve(this.verifyNextAuthorizationRole(name, roles, index++, config));
          }
        }); 
      } else {
        reject();
      }
    });
  }
  
  /**
   * Given the route, config, and expressResponse. Runs the route method
   */
  private static runMethod(route: IRoute, config: RequestConfig, expressResponse: any) {
    let properties = PropertyManager.getProperties(route.object, route.key);
    PropertyManager.getPropertyValues(properties, config).then((response: Response) => {
      if(response.type === ResponseType.Success) {
        let object = route.object;
        let method = route.key;
        let objectMethod = object[method];

        let data = objectMethod.apply(object, response.data);

        ResponseHandler.handleResponse(route, expressResponse, data);
      } else {
        ResponseHandler.handleResponse(route, expressResponse, response);
      }
    }).catch((response: Response) => {
      ResponseHandler.handleResponse(route, expressResponse, ResponseHandler.convertErrorResponse(response));
    });
  }

}