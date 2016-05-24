import fatal from '../error';

export class IRuleHandler {
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
  public static handlers: IRuleHandler[] = [];
  
  public static rules: IRule[] = [];
  
  /**
   * Registers the given authorization rule
   */
  public static registerRule(rule: IRule) {
    this.rules.push(rule);
  }

  /**
   * Registers the given authorization handler
   */
  public static registerRuleHandler(handler: IRuleHandler) {
    let namedHandler = this.getHandlerByGroupAndName(handler.group, handler.name);

    if(namedHandler) {
      fatal(new Error(`Unable to register rule at ${handler.object.prototype.constructor.name}.${handler.method} with the group '${handler.group}' and name '${handler.name}'. ${namedHandler.object.prototype.constructor.name}.${namedHandler.method} has already registered this group/name combination.`));
    }

    this.handlers.push(handler);
  }

  /**
   * Returns the authorization handler by name
   */
  public static getHandlerByGroupAndName(group: string, name: string): IRuleHandler {
    let handler: IRuleHandler = null;

    this.handlers.forEach((res) => {
      if(res.group === group && res.name === name) {
        handler = res;
      }
    });

    return handler;
  }
  
  /**
   * Returns the authorization handler bound to the given object and object method
   */
  public static getRuleHandler(object: any, method: string): IRuleHandler {
    let handler: IRuleHandler = null;

    this.handlers.forEach((res) => {
      if(res.object === object && res.method === method) {
        handler = res;
      }
    });

    return handler;
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