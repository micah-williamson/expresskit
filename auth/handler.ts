import {IAuthHandler, AuthManager} from './manager';

export function AuthHandler(name: string, isDefault?: boolean) {
  return function(object: any, method: string) {
    let handler: IAuthHandler = {
      name: name,
      isDefault: !!isDefault,
      object: object,
      method: method
    };

    AuthManager.registerAuthenticationHandler(handler);
  }
}