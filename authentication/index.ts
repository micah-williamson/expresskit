import {IAuthenticationResource, default as AuthenticationManager} from './manager';

export default function Authentication(name: string, isDefault?: boolean) {
  return function(object: any, method: string) {
    let resource: IAuthenticationResource = {
      name: name,
      isDefault: !!isDefault,
      object: object,
      method: method
    };

    AuthenticationManager.registerAuthenticationResource(resource);
    //RouteManager.registerRouteProperty(object, method, property);
  }
}