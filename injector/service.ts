import {Reflect} from '../reflect';
import {Response, ResponseType} from '../route/response';

import {Injection, IInjectable, IInjectionConfig, IInjectionResolver} from './';

export class InjectorService {

  public static registerInjection(object: any, method: any, injectionConfig: IInjectionConfig) {
    let injection = <Injection>Reflect.getMetadata('Injection', object, method) || [];

    injection.push(injectionConfig);

    Reflect.defineMetadata('Injection', injection, object, method);
  }

  public static run(object: any, method: any, context: any): Promise<Response> {
    return new Promise((resolve, reject) => {
      let injection = <Injection>Reflect.getMetadata('Injection', object, method) || [];

      this.resolveInjection(injection, context).then((response: Response) => {
        if(response.type === ResponseType.Success) {
          let methodResult = object[method].apply(object, response.data);
          resolve(methodResult);
        } else {
          reject(response);
        }
      }).catch((response: Response) => {
        reject(response);
      });
    });
  }

  public static resolveInjection(injection: Injection, context: any): Promise<any> {
    let returnPromises: Promise<any>[] = [];

    injection.forEach((injectionConfig) => {
      returnPromises[injectionConfig.injectable.index] = injectionConfig.injectionResolver.resolve(injectionConfig.injectable, context)
    });

    return Promise.all(returnPromises).then((values: any[]) => {
      return new Response(200, values);
    });
  }

}