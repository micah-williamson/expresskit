import {IRoute} from './manager';
import PropertyManager from '../property/manager';
import {IRule, default as RuleManager} from '../rule/manager';
import ResponseHandler from './responseHandler';
import {ResponseType, default as Response} from './response';
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
      let rules = RuleManager.getRules(route.object, route.key);
      
      if(rules.length) {
        this.verifyRules(rules, config).then(() => {
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
   * Verifies all rules are met
   */
  private static verifyRules(rules: IRule[], config: RequestConfig): Promise<Response> {
    let promises: Promise<Response>[] = [];
    
    rules.forEach((rule) => {
      promises.push(this.verifyRule(rule, config));
    });
    
    return Promise.all(promises).then(() => {
      return new Response(200, 'Ok');
    });
  }
  
  /**
   * Verifies at least one rule is met
   */
  private static verifyRule(rule: IRule, config: RequestConfig): Promise<Response> {
    return new Promise((resolve, reject) => {
      let group = rule.group;
      let names = rule.names;
      let promises: Promise<Response>[] = [];
      let index = 0;
      
      this.verifyNextRule(group, names, index, config).then(() => {
        resolve();
      }).catch((response: Response) => {
        if(response instanceof Response) {
          reject(response);
        }
        
        reject(new Response(500, 'One or more route rules were not satisfied. Error was not given.'));
      }); 
    });
  }
  
  /**
   * Given the group, the name, and the index. Continues to try to validate a rule for the request
   * until one rule is satisfied or there are no more rules to try.
   */
  private static verifyNextRule(group: string, names: string[], index: number, config: RequestConfig) {
    return new Promise((resolve, reject) => {
      if(names[index]) {
        let handler = RuleManager.getHandlerByGroupAndName(group, names[index]);
        let properties = PropertyManager.getProperties(handler.object, handler.method);
        let rulePromise = PropertyManager.getPropertyValues(properties, config).then((response: Response) => {
          if(response.type === ResponseType.Success) {
            handler.object[handler.method].apply(handler.object, response.data).then(() => {
              resolve();
            }).catch((response: Response) => {
              if(names[++index]) {
                resolve(this.verifyNextRule(group, names, index, config));
              } else {
                reject(response);
              }
            });
          } else {
            if(names[++index]) {
              resolve(this.verifyNextRule(group, names, index, config));
            } else {
              reject(response);
            }
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