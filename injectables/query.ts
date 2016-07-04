import {InjectorService, IInjectable, IInjectionConfig, IInjectionResolver} from 'restkit/injector';
import {OptionalResolver} from './optional';

export function Query(name: string) {
  return function(object: any, method: string, index: number) {
    let injectable: IInjectable = {
      index: index,
      arguments: [name]
    };

    let injectionConfig: IInjectionConfig = {
      injectionResolver: new QueryInjectionResolver(),
      injectable: injectable
    };

    InjectorService.registerInjection(object, method, injectionConfig);
  }
}

export class QueryInjectionResolver extends OptionalResolver implements IInjectionResolver {

  public resolve(injectable: IInjectable, request: any): Promise<any> {
    let paramName = injectable.arguments[0];
    let optionalParts = this.getOptionalParts(paramName);
    let val = request.query[optionalParts.name];

    return this.optionallyResolve(optionalParts, val, 'query parameter');
  }
  
}