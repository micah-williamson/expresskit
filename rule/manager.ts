export class IRuleResource {
  public group: string;

  public name: string;

  public object: any;

  public method: string;
}

export class IRule {
  public group: string;
  
  public names: string[];
  
  public object: any;
  
  public method: string;
}

export default class RuleManager {
  public static resources: IRuleResource[] = [];
  
  public static rules: IRule[] = [];
  
  /**
   * Registers the given authorization rule
   */
  public static registerRuleResource(rule: IRule) {
    this.rules.push(rule);
  }

  /**
   * Registers the given authorization resource
   */
  public static registerAuthorizationResource(resource: IRuleResource) {
    let namedResource = this.getResourceByGroupAndName(resource.group, resource.name);

    if(namedResource) {
      throw new Error(`Unable to register rule at ${resource.object.prototype.constructor.name}.${resource.method} with the group '${resource.group}' and name '${resource.name}'. ${namedResource.object.prototype.constructor.name}.${namedResource.method} has already registered this group/name combination.`);
    }

    this.resources.push(resource);
  }

  /**
   * Returns the authorization resource by name
   */
  public static getResourceByGroupAndName(group: string, name: string): IRuleResource {
    let resource: IRuleResource = null;

    this.resources.forEach((res) => {
      if(res.group === group && res.name === name) {
        resource = res;
      }
    });

    return resource;
  }
  
  /**
   * Returns the authorization resource bound to the given object and object method
   */
  public static getRuleResource(object: any, method: string): IRuleResource {
    let resource: IRuleResource = null;

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
  public static getRules(object: any, method: string): IRule[] {
    let rules: IRule[] = [];
    
    this.rules.forEach((rl) => {
      if(rl.object === object && rl.method === method) {
        rules.push(rl);
      }
    });
    
    return rules;
  }
}