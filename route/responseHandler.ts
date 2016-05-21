import {IRoute} from './manager';

interface RequestResponse {
  httpCode: number;
  message: any;
}

interface RequestError {
  httpCode: number;
  message: any;
}

export default class ResponseHandlerService {

  public static handleResponse(route: IRoute, expressResponse: any, methodResponse: any) {
    if(methodResponse.then) {
      methodResponse.then((payload: any) => {
        this.handleResponseSuccess(route, expressResponse, payload);
      }).catch((payload: any) => {
        this.handleResponseError(route, expressResponse, payload);
      });
    } else {
      this.handleResponseSuccess(route, expressResponse, methodResponse);
    }
  }

  private static handleResponseSuccess(route: IRoute, expressResponse: any, responsePayload: any) {
    let response: RequestResponse = {
      httpCode: 200,
      message: responsePayload
    };

    expressResponse.status(response.httpCode).send(response.message);
  }

  private static handleResponseError(route: IRoute, expressResponse: any, errorPayload: any) {
    let response: RequestResponse = {
      httpCode: 500,
      message: errorPayload
    };

    expressResponse.status(response.httpCode).send(response.message);
  }

}