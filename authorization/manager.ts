export class IAuthorizationResource {
  public name: string;

  public role: string;

  public object: any;

  public method: string;
}

export class IAuthorizationRule {
  public name: string;
  
  public roles: string[];
  
  public object: any;
  
  public method: string;
}

export default class AuthorizationManager {
  public static resources: IAuthorizationResource[] = [];
  
  public static rules: IAuthorizationRule[] = [];
  
  /**
   * Registers the given authorization rule
   */
  public static registerAuthorizationRule(rule: IAuthorizationRule) {
    let existingRule = this.getRule(rule.object, rule.method);
    
    if(existingRule) {
      throw new Error(`Unable to register multiple authorization rules on ${rule.object.prototype.constructor.name}.${rule.method}.`);
    }
    
    this.rules.push(rule);
  }

  /**
   * Registers the given authorization resource
   */
  public static registerAuthorizationResource(resource: IAuthorizationResource) {
    let namedResource = this.getResourceByNameAndRole(resource.name, resource.role);

    if(namedResource) {
      throw new Error(`Unable to register authorization at ${resource.object.prototype.constructor.name}.${resource.method} with the name '${resource.name}' and role '${resource.role}'. ${namedResource.object.prototype.constructor.name}.${namedResource.method} has already registered this name and role.`);
    }

    this.resources.push(resource);
  }

  /**
   * Returns the authorization resource by name
   */
  public static getResourceByNameAndRole(nm: string, role: string): IAuthorizationResource {
    let resource: IAuthorizationResource = null;

    this.resources.forEach((res) => {
      if(res.name === nm && res.role === role) {
        resource = res;
      }
    });

    return resource;
  }
  
  /**
   * Returns the authorization resource bound to the given object and object method
   */
  public static getResource(object: any, method: string): IAuthorizationResource {
    let resource: IAuthorizationResource = null;

    this.resources.forEach((res) => {
      if(res.object === object && res.method === method) {
        resource = res;
      }
    });

    return resource;
  }
  
  /**
   * Returns the authorization rule bound to the given object and object method
   */
  public static getRule(object: any, method: string): IAuthorizationRule {
    let rule: IAuthorizationRule = null;
    
    this.rules.forEach((rl) => {
      if(rl.object === object && rl.method === method) {
        rule = rl;
      }
    });
    
    return rule;
  }
}