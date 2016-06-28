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