import {IRoute} from './manager';
import PropertyManager from '../property/manager';
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

}