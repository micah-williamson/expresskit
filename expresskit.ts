import {Restkit} from 'restkit';
import {IStaticUriPath} from 'restkit';
import {ExpressServer} from './server';

export interface IExpresskitConfig {
  server?: any;
  port?: number;
  timezone?: string;
  staticFiles?: IStaticUriPath[];
  staticPaths?: IStaticUriPath[];
  middleware?: any[];
}

export class Expresskit {
  public static start(config?: IExpresskitConfig) {
    config.server = config.server || new ExpressServer();
    Restkit.start(<any>config);
  }

  public static stop() {
    Restkit.stop();
  }
}