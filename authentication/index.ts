import {IAuthenticationResource, default as AuthenticationManager} from './manager';

export default function Authentication(name: string, isDefault?: boolean) {
  return function(object: any) {
    let resource: IAuthenticationResource = {
      name: name,
      isDefault: !!isDefault,
      resolve: object.resolve
    };

    AuthenticationManager.registerAuthenticationResource(resource);
    //RouteManager.registerRouteProperty(object, method, property);
  }
}