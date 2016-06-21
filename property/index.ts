import PropertyManager from './manager';

export enum PropertyType {Body, Param, Query, Header, Auth};

export interface IProperty {
  type: PropertyType;
  object: any;
  method: string;
  name: any;
  index: number;
  optional: boolean;
  defaultValue: any;
}

export function Body(dto?: Object) {
  return function(object: any, method: string, index: number) {
    let property: IProperty = {
      type: PropertyType.Body,
      object: object,
      method: method,
      name: dto,
      index: index,
      optional: false,
      defaultValue: undefined
    };

    PropertyManager.registerProperty(property);
  }
}

export function Query(name: string) {
  return function(object: any, method: string, index: number) {
    registerProperty(name, object, method, index, PropertyType.Query);
  }
}

export function Param(name: string) {
  return function(object: any, method: string, index: number) {
    registerProperty(name, object, method, index, PropertyType.Param);
  }
}

export function Header(name: string) {
  return function(object: any, method: string, index: number) {
    registerProperty(name, object, method, index, PropertyType.Header);
  }
}

function registerProperty(name: string, object: any, method: string, index: number, type: PropertyType) {
  let optional = false;
  let defaultValue: any;

  if(name[name.length-1] === '?') {
    optional = true;
    name = name.substr(0, name.length-1);
  } else {
    let defaultParts = name.split('=');
    if(defaultParts.length === 2) {
      name = defaultParts[0];
      defaultValue = defaultParts[1];
    }
  }

  let property: IProperty = {
    type: type,
    object: object,
    method: method,
    name: name,
    index: index,
    optional: optional,
    defaultValue: defaultValue
  };

  PropertyManager.registerProperty(property);
}