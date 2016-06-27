import {Reflect} from '../reflect';
import {IValidationRules, IValidationTags} from './manager';

export function ResponseType(dto: any) {
  return function(object: any, property: any) {
    Reflect.defineMetadata('ResponseType', dto, object, property);
  }
}

export function Validate(rules: IValidationRules) {
  return function(object: any, property: any) {
    registerDTOProperty(object, property);

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

export function ScrubIn(tags?: IValidationTags) {
  return function(object: any, property: any) {
    registerDTOProperty(object, property);
    
    Reflect.defineMetadata('ScrubIn', tags, object, property);
  }
}

export function ScrubOut(tags?: IValidationTags) {
  return function(object: any, property: any) {
    registerDTOProperty(object, property);

    Reflect.defineMetadata('ScrubOut', tags, object, property);
  }
}

function registerDTOProperty(object: any, property: any) {
  let dto = Reflect.getMetadata('DTO', object) || [];
  if(dto.indexOf(property) === -1) {
    dto.push(property);
  }
  Reflect.defineMetadata('DTO', dto, object);
}
