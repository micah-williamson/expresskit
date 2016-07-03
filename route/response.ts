export enum ResponseType {Success, Error};

export class Response {
  public type: ResponseType;

  public constructor(public httpCode: number, public data: any) {
    if(httpCode >= 400) {
      this.type = ResponseType.Error;
    } else {
      this.type = ResponseType.Success;
    }
  }
}

export class ResponseService {  

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

}