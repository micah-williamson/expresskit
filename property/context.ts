import {Request as ExpressRequest} from 'express';

import {InjectorService} from '../injector/service';
import {IInjectable, IInjectionConfig, IInjectionResolver} from '../injector';
import {OptionalResolver} from './optional';

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

  public resolve(injectable: IInjectable, request: ExpressRequest): Promise<any> {
    return Promise.resolve(request);
  }
  
}