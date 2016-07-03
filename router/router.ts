export abstract class ExpresskitRouter {
  constructor(public mount: string, public router: any) {}

  public abstract bindSelf(parent: any): any;
  
  public abstract use (... args: any[]): any;
  
  public abstract static (... args: any[]): any;
  
  public abstract get (... args: any[]): any;
  
  public abstract put (... args: any[]): any;

  public abstract post (... args: any[]): any;

  public abstract delete (... args: any[]): any;
}