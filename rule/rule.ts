import RuleManager from './manager';
import RouteManager from '../route/manager';

export default function Rule(group: string, names: string) {
  return function(object: any, method: string, index: number) {
    let namesArray = names.split(/,|\s+/);
    let finalNames: string[] = [];
    for(var i = 0; i < namesArray.length; i++) {
      let r = namesArray[i];
      if(r) {
        finalNames.push(r); 
      }
    }
    
    if(!finalNames.length) {
      throw new Error(`Unable to register rule group '${group}' on ${object.prototype.constructor.name}.${method}. No rule names found. Use: @Rule('group', 'name1,name2')`);
    }
    
    namesArray.forEach((name) => {
      let authorizationResource = RuleManager.getResourceByGroupAndName(group, name);
      
      if(!authorizationResource) {
        throw new Error(`Unable to register rule ${group}.${name} to ${object.prototype.constructor.name}.${method}. This group.name combination does not exist.`);
      }
    });
    
    RuleManager.registerAuthorizationRule({
      group: group,
      names: finalNames,
      object: object,
      method: method
    });
  }
}