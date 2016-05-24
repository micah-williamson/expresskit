import {IRoute} from './manager';
import Response from './response';

export default class ResponseHandlerService {

  public static handleResponse(route: IRoute, expressResponse: any, methodResponse: any) {
    if(methodResponse && methodResponse.then) {
      methodResponse.then((payload: any) => {
        let response = this.convertSuccessResponse(payload);
        this.sendResponse(response, expressResponse);
      }).catch((payload: any) => {
        let response = this.convertErrorResponse(payload);
        this.sendResponse(response, expressResponse);
      });
    } else {
      let response = this.convertSuccessResponse(methodResponse);
      this.sendResponse(response, expressResponse);
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
    }

    return new Response(500, data);
  }

  private static sendResponse(response: Response, expressResponse: any) {
    expressResponse.status(response.httpCode).send(response.data);
  }

}