import {Reflect} from '../reflect';

import Expresskit from '../index';
import {IRoute} from './manager';
import {DTOManager} from '../dto/manager';
import {Response} from './response';

export class ResponseHandlerService {

  public static handleResponse(route: IRoute, expressResponse: any, methodResponse: any): any {
    if(methodResponse && methodResponse.then) {
      return methodResponse.then((payload: any) => {
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
      data = data.stack.toString();
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
    
    Expresskit.server.sendResponse(route, response, expressResponse);
  }

}