import {InjectorService} from '../injector/service';
import {IInjectable, IInjectionConfig, IInjectionResolver} from '../injector';
import {OptionalResolver} from './optional';
import {ExpresskitServer} from '../server';

export function Context() {
  return function(object: any, method: string, index: number) {
    let injectable: IInjectable = {
      index: index,
      arguments: []
    };

    let injectionConfig: IInjectionConfig = {
      injectionResolver: new ContextInjectionResolver(),
      injectable: injectable
    };

    InjectorService.registerInjection(object, method, injectionConfig);
  }
}

export class ContextInjectionResolver extends OptionalResolver implements IInjectionResolver {

  public resolve(server: ExpresskitServer, injectable: IInjectable, request: any): Promise<any> {
    return Promise.resolve(request);
  }
  
}