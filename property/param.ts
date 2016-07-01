import {InjectorService} from '../injector/service';
import {IInjectable, IInjectionConfig, IInjectionResolver} from '../injector';
import {OptionalResolver} from './optional';

export function Param(name: string) {
  return function(object: any, method: string, index: number) {
    let injectable: IInjectable = {
      index: index,
      arguments: [name]
    };

    let injectionConfig: IInjectionConfig = {
      injectionResolver: new ParamInjectionResolver(),
      injectable: injectable
    };

    InjectorService.registerInjection(object, method, injectionConfig);
  }
}

export class ParamInjectionResolver extends OptionalResolver implements IInjectionResolver {

  public resolve(injectable: IInjectable, request: any): Promise<any> {
    let paramName = injectable.arguments[0];
    let optionalParts = this.getOptionalParts(paramName);
    let val = request.params[optionalParts.name];

    return this.optionallyResolve(optionalParts, val, 'parameter');
  }
  
}