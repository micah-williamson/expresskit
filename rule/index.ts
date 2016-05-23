import {IRuleResource, default as RuleManager} from './manager';

export default function RuleResource(group: string, name: string) {
  return function(object: any, method: string) {
    let resource: IRuleResource = {
      group: group,
      name: name,
      object: object,
      method: method
    };

    RuleManager.registerAuthorizationResource(resource);
  }
}