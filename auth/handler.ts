import {IAuthHandler, default as AuthenticationManager} from './manager';

export default function AuthHandler(name: string, isDefault?: boolean) {
  return function(object: any, method: string) {
    let handler: IAuthHandler = {
      name: name,
      isDefault: !!isDefault,
      object: object,
      method: method
    };

    AuthenticationManager.registerAuthenticationHandler(handler);
    //RouteManager.registerRouteProperty(object, method, property);
  }
}