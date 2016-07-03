import {Reflect} from '../reflect';

import {IValidationRules, IValidationTags} from './manager';

export function ScrubIn(tags: IValidationTags = {}) {
  return function(object: any, property: any) {
    let dto = Reflect.getMetadata('DTO', object) || [];
    if(dto.indexOf(property) === -1) {
      dto.push(property);
    }
    
    Reflect.defineMetadata('DTO', dto, object);
    
    Reflect.defineMetadata('ScrubIn', tags, object, property);
  }
}