import AuthorizationManager from './manager';
import RouteManager from '../route/manager';

export default function Authorize(name: string, roles: string) {
  return function(object: any, method: string, index: number) {
    let rolesArray = roles.split(/,|\s+/);
    let finalRoles: string[] = [];
    for(var i = 0; i < rolesArray.length; i++) {
      let r = rolesArray[i];
      if(r) {
        finalRoles.push(r); 
      }
    }
    
    if(!finalRoles.length) {
      throw new Error(`Unable to register authorization rule on ${object.prototype.constructor.name}.${method}. No roles found.`);
    }
    
    rolesArray.forEach((role) => {
      let authorizationResource = AuthorizationManager.getResourceByNameAndRole(name, role);
      
      if(!authorizationResource) {
        throw new Error(`Unable to register authorization rule ${name}=${role} to ${object.prototype.constructor.name}.${method}. This name/role combination does not exist.`);
      }
    });
    
    AuthorizationManager.registerAuthorizationRule({
      name: name,
      roles: finalRoles,
      object: object,
      method: method
    });
  }
}