import {Reflect} from '../reflect';

import {IValidationRules, IValidationTags} from './manager';
import {fatal} from '../error';

export function Validate(rules: IValidationRules) {
  return function(object: any, property: any) {
    let dto = Reflect.getMetadata('DTO', object) || [];
    if(dto.indexOf(property) === -1) {
      dto.push(property);
    }
    
    Reflect.defineMetadata('DTO', dto, object);

    for(var key in rules) {
      if(key[0] !== '$') {
        let val = rules[key];

        if(typeof val !== 'object') {
          rules[key] = [val, null];
        } else if(!val.hasOwnProperty('length')) {
          rules[key] = [val, null];
        }
      }
    }

    let validation = Reflect.getMetadata('Validation', object, property) || [];
    validation.push(rules);

    Reflect.defineMetadata('Validation', validation, object, property);
  }
}