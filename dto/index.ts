import {Reflect} from '../reflect';

export function Response(name: string) {
  
}

export function Required() {
  return function(object: any, property: any) {
    let dto = Reflect.getMetadata('DTO', object) || [];
    if(dto.indexOf(property) === -1) {
      dto.push(property);
    }
    Reflect.defineMetadata('DTO', dto, object);
    
    Reflect.defineMetadata('Required', true, object, property);
  }
}

export function ScrubIn() {
  return function(object: any, property: any) {
    let dto = Reflect.getMetadata('DTO', object) || [];
    if(dto.indexOf(property) === -1) {
      dto.push(property);
    }
    Reflect.defineMetadata('DTO', dto, object);
    
    Reflect.defineMetadata('ScrubIn', true, object, property);
  }
}

export function ScrubOut() {
  return function(object: any, property: any) {
    let dto = Reflect.getMetadata('DTO', object) || [];
    if(dto.indexOf(property) === -1) {
      dto.push(property);
    }
    Reflect.defineMetadata('DTO', dto, object);
    
    Reflect.defineMetadata('ScrubOut', true, object, property);
  }
}