import {IAuthorizationResource, default as AuthorizationManager} from './manager';

export default function Authentication(name: string, role: string) {
  return function(object: any, method: string) {
    let resource: IAuthorizationResource = {
      name: name,
      role: role,
      object: object,
      method: method
    };

    AuthorizationManager.registerAuthorizationResource(resource);
    //RouteManager.registerRouteProperty(object, method, property);
  }
}