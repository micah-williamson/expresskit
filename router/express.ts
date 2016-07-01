import {ExpresskitRouter} from './router';

export class ExpressRouter extends ExpresskitRouter {
  public bindToApplication(application: any) {
    application.use(this.mount, this.router);
  }
}