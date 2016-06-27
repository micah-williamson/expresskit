import {IRoute} from './manager';
import {DTOManager} from '../dto/manager';
import {Reflect} from '../reflect';
import Response from './response';

export default class ResponseHandlerService {

  public static handleResponse(route: IRoute, expressResponse: any, methodResponse: any) {
    if(methodResponse && methodResponse.then) {
      methodResponse.then((payload: any) => {
        let response = this.convertSuccessResponse(payload);
        this.sendResponse(route, response, expressResponse);
      }).catch((payload: any) => {
        let response = this.convertErrorResponse(payload);
        this.sendResponse(route, response, expressResponse);
      });
    } else {
      let response = this.convertSuccessResponse(methodResponse);
      this.sendResponse(route, response, expressResponse);
    }
  }

  public static convertSuccessResponse(data: any): Response {
    if(data instanceof Response) {
      return data;
    }

    return new Response(data !== undefined ? 200 : 204, data);
  }

  public static convertErrorResponse(data: any): Response {
    if(data instanceof Response) {
      return data;
    } else if (data instanceof Error) {
      if(data.toString() === 'Error') {
        data = data.stack.toString();
      } else {
        data = data.toString();
      }
    }

    return new Response(500, data);
  }

  private static sendResponse(route: IRoute, response: Response, expressResponse: any) {
    let object = route.object;
    let key = route.key;

    let responseType = Reflect.getMetadata('ResponseType', object, key);
    if(responseType) {
      DTOManager.scrubOut(response.data, responseType);
    }

    expressResponse.status(response.httpCode).send(response.data);
  }

}