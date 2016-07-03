import {InjectorService} from '../injector/service';
import {IInjectable, IInjectionConfig, IInjectionResolver} from '../injector';
import {Response, ResponseType} from '../route/response';
import {IAuthHandler, AuthManager} from './manager';
import {fatal} from '../error';
import {ExpresskitServer} from '../server';

export function Auth(name?: string) {
  return function(object: any, method: string, index: number) {
    let injectable: IInjectable = {
      index: index,
      arguments: [name]
    };

    let injectionConfig: IInjectionConfig = {
      injectionResolver: new AuthenticationInjectionResolver(),
      injectable: injectable
    };

    InjectorService.registerInjection(object, method, injectionConfig);
  }
}

export class AuthenticationInjectionResolver implements IInjectionResolver {

  public resolve(server: ExpresskitServer, injectable: IInjectable, request: any): Promise<any> {
    return new Promise((resolve, reject) => { 
      let name = injectable.arguments[0];
      let authResource: IAuthHandler;

      if(name) {
        authResource = AuthManager.getHandlerByName(name);
      } else {
        authResource = AuthManager.getDefault();
      }

      InjectorService.run(server, authResource.object, authResource.method, request).then((response: any) => {
          if(response.type === ResponseType.Error) {
            reject(response);
          } else {
            resolve(response);
          }
        })
        .catch((response: any) => {
          // If a Response wasn't returned, force a 401 response
          if(!(response instanceof Response) && !(response instanceof Error)) {
            reject(new Response(401, response));
          } else {
            reject(response);
          }
        });
    });
  }

}