import {IRoute} from './manager';
import PropertyManager from '../property/manager';
import ResponseHandler from './responseHandler';
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
    return (request: any, response: any) => {
      let config = this.generateRequestConfig(request);
      let properties = PropertyManager.getProperties(route.object, route.key);
      let propertyValues = PropertyManager.getPropertyValues(properties, config);

      let object = route.object;
      let method = route.key;
      let objectMethod = object[method];

      let res = objectMethod.apply(object, propertyValues);
      ResponseHandler.handleResponse(route, response, res);
    }
  }

}