import {ExpresskitRouter} from '../router';

export abstract class ExpresskitServer {
  public package: any;

  public application: any;

  public listenHandle: any;

  public router: ExpresskitRouter;

  public abstract createRouter (... args: any[]): ExpresskitRouter;
  
  public abstract listen (... args: any[]): any;

  public abstract stop(... args: any[]): any;
  
  public abstract use (... args: any[]): any;
  
  public abstract getHeader(request: any, name: string): string;
  
  public abstract getQuery(request: any, name: string): string;
  
  public abstract getParam(request: any, name: string): string;
  
  public abstract getBody(request: any): any;
  
  public abstract getRequestHandler(... args: any[]): Function;
  
  public abstract sendResponse(... args: any[]): any;
}