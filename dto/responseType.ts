import {Reflect} from '../reflect';

export function ResponseType(dto: any) {
  return function(object: any, property: any) {
    Reflect.defineMetadata('ResponseType', dto, object, property);
  }
}