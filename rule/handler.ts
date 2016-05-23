import {IRuleHandler, default as RuleManager} from './manager';

export default function RuleHandler(group: string, name: string) {
  return function(object: any, method: string) {
    let handler: IRuleHandler = {
      group: group,
      name: name,
      object: object,
      method: method
    };

    RuleManager.registerRuleHandler(handler);
  }
}