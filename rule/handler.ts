import {Reflect} from '../reflect';
import {IRuleHandler, RuleService} from './service';

export function RuleHandler(name: string) {
  return function(object: any, method: string) {
    let handler: IRuleHandler = {
      name: name,
      object: object,
      method: method
    };

    RuleService.registerRuleHandler(handler);

    Reflect.defineMetadata('RuleHandler', handler, object, method);
  }
}