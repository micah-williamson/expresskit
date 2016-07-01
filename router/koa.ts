import {ExpresskitRouter} from './router';

export class KoaRouter extends ExpresskitRouter {
  public bindToApplication(application: any) {
    application.use(this.router.routes());
    application.use(this.router.allowedMethods());
  }
}