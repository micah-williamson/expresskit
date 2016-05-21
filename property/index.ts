import PropertyManager from './manager';

export enum PropertyType {Param, Query, Header, Auth};

export interface IProperty {
  type: PropertyType;
  object: any;
  method: string;
  name: string;
  index: number;
}

export function Query(name: string) {
  return function(object: any, method: string, index: number) {
    let property: IProperty = {
      type: PropertyType.Query,
      object: object,
      method: method,
      name: name,
      index: index
    };

    PropertyManager.registerProperty(property);
  }
}

export function Param(name: string) {
  return function(object: any, method: string, index: number) {
    let property: IProperty = {
      type: PropertyType.Param,
      object: object,
      method: method,
      name: name,
      index: index
    };

    PropertyManager.registerProperty(property);
  }
}

export function Header(name: string) {
  return function(object: any, method: string, index: number) {
    let property: IProperty = {
      type: PropertyType.Header,
      object: object,
      method: method,
      name: name,
      index: index
    };

    PropertyManager.registerProperty(property);
  }
}

export function Auth(name?: string) {
  return function(object: any, method: string, index: number) {
    let property: IProperty = {
      type: PropertyType.Auth,
      object: object,
      method: method,
      name: name,
      index: index
    };

    PropertyManager.registerProperty(property);
  }
}