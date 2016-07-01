export abstract class ExpresskitRouter {
  constructor(public mount: string, public router: any) {}

  public abstract bindToApplication(application: any): any;
}