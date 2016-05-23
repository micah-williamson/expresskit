import AuthManager from './manager';
import {IProperty, PropertyType} from '../property';
import PropertyManager from '../property/manager';

export default function Auth(name?: string) {
  return function(object: any, method: string, index: number) {
    if(!name) {
      if(!AuthManager.hasDefault()) {
        throw new Error(`Unable to resolve no-named Auth property on ${object.prototype.constructor.name}.${method}. There is no registered default authentication handler.`);
      }
    } else {
      if(!AuthManager.getHandlerByName(name)) {
        throw new Error(`Unable to resolve Auth property ('${name}') on ${object.prototype.constructor.name}.${method}. There is no authentication handler registered by this name.`);
      }
    }

    let property: IProperty = {
      type: PropertyType.Auth,
      object: object,
      method: method,
      name: name,
      index: index,
      optional: false,
      defaultValue: undefined
    };

    PropertyManager.registerProperty(property);
  }
}