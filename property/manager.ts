import {IProperty, PropertyType} from './index';
import RequestConfig from '../request';
import ResponseHandler from '../route/responseHandler';
import AuthenticationManager from '../authentication/manager';

export default class PropertyManager {
  public static properties: IProperty[] = [];

  public static registerProperty(binding: IProperty) {

  }

  /**
   * @description Given the route and the requestConfig, returns an array of values
   *              that can be used to call the route method via `apply`.
   * @param {IRoute}        route  [description]
   * @param {RequestConfig} config [description]
   */
  public static getPropertyValues(properties: IProperty[], config: RequestConfig) {
    let returnValues: any[] = [];

    properties.forEach((prop) => {
      switch(prop.type) {
        case PropertyType.Param:
          returnValues[prop.index] = config.params[prop.name];
          break;
        case PropertyType.Query:
          returnValues[prop.index] = config.query[prop.name];
          break;
        case PropertyType.Header:
          returnValues[prop.index] = config.request.header(prop.name);
          break;
        case PropertyType.Auth:
          returnValues[prop.index] = this.resolveAuthType(prop, config);
          break;
      }
    });

    return returnValues;
  }

  public static resolveAuthType(prop: IProperty, config: RequestConfig): {
    let name = prop.name;
    let authResource = AuthenticationManager.getResourceByName(name);

    let propertyValues = this.getProperties(authResource, 'resolve');
    let properties = this.getPropertyValues(propertyValues, config);

    let response = authResource.resolve.apply(authResource, properties);
    if(response.then) {
      return response.then;
    }

    return new Promise((r, r2) => {})
  }

  public static getProperties(object: any, method: string): IProperty[] {
    let properties: IProperty[] = [];

    this.properties.forEach((property) => {
      if(property.object === object && property.method === method) {
        properties.push(property);
      }
    });

    return properties;
  }
}