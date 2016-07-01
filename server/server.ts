import {ExpresskitRouter} from '../router';

export abstract class ExpresskitServer {
  public package: any;

  public application: any;

  public listenHandle: any;

  public expresskitRouter: ExpresskitRouter;

  public abstract Router (... args: any[]): ExpresskitRouter;

  public abstract use (... args: any[]): any;

  public abstract listen (... args: any[]): any;

  public abstract stop(... args: any[]): any;

  public abstract static(... args: any[]): any;

  public abstract get (... args: any[]): any;
  
  public abstract put (... args: any[]): any;

  public abstract post (... args: any[]): any;

  public abstract delete (... args: any[]): any;
}