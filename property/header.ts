import {InjectorService} from '../injector/service';
import {IInjectable, IInjectionConfig, IInjectionResolver} from '../injector';
import {OptionalResolver} from './optional';
import {ExpresskitServer} from '../server';

export function Header(name: string) {
  return function(object: any, method: string, index: number) {
    let injectable: IInjectable = {
      index: index,
      arguments: [name]
    };

    let injectionConfig: IInjectionConfig = {
      injectionResolver: new HeaderInjectionResolver(),
      injectable: injectable
    };

    InjectorService.registerInjection(object, method, injectionConfig);
  }
}

export class HeaderInjectionResolver extends OptionalResolver implements IInjectionResolver {

  public resolve(server: ExpresskitServer, injectable: IInjectable, request: any): Promise<any> {
    let paramName = injectable.arguments[0];
    let optionalParts = this.getOptionalParts(paramName);
    let val = server.getHeader(request, optionalParts.name);

    return this.optionallyResolve(optionalParts, val, 'header');
  }
  
}