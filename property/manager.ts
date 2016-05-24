import {IProperty, PropertyType} from './index';
import RequestConfig from '../request';
import {Response, ResponseType, default as ResponseHandler} from '../route/responseHandler';
import {IAuthHandler, default as AuthManager} from '../auth/manager';
import fatal from '../error';

export default class PropertyManager {
  public static properties: IProperty[] = [];

  /**
   * Attempts to register the given property
   * 
   * @param {IProperty}
   */
  public static registerProperty(property: IProperty) {
    let existingProperty = this.getProperty(property.object, property.method, property.name, property.type);
    if(existingProperty) {
      fatal(new Error(`Unable to register Property (type:'${property.type}') '${property.name}' to ${property.object.prototype.constructor.name}.${property.method}. This property is already registered to this class method.`));
    }

    this.properties.push(property);
  }

  /**
   * Given the route and the requestConfig, returns an array of values
   *   that can be used to call the route method via `apply`.
   *   
   * @param {IRoute}        route  [description]
   * @param {RequestConfig} config [description]
   */
  public static getPropertyValues(properties: IProperty[], config: RequestConfig) {
    let returnPromises: Promise<any>[] = [];

    properties.forEach((prop) => {
      switch(prop.type) {
        case PropertyType.Body:
          returnPromises[prop.index] = Promise.resolve(config.request.body);
          break;
        case PropertyType.Param:
          returnPromises[prop.index] = this.resolveParam(prop, config);
          break;
        case PropertyType.Query:
          returnPromises[prop.index] = this.resolveQuery(prop, config);
          break;
        case PropertyType.Header:
          returnPromises[prop.index] = this.resolveHeader(prop, config);
          break;
        case PropertyType.Auth:
          returnPromises[prop.index] = Promise.resolve(this.resolveAuthentication(prop, config));
          break;
      }
    });

    let returnValues: any[] = [];
    for(var i = 0; i < returnPromises.length; i++) {
      (function(i: number, promise: Promise<any>) {
        promise.then((val: any) => {
          return returnValues[i] = val;
        });
      })(i, returnPromises[i]);
    }


    return Promise.all(returnPromises).then(() => {
      for(var i = 0; i < returnValues.length; i++) {
        let returnValue = returnValues[i];
      }

      return new Response(200, returnValues);
    });
  }

  /**
   * Resolves the query
   * 
   * @param  {IProperty}
   * @param  {RequestConfig}
   * @return {Promise<any>}
   */
  private static resolveQuery(property: IProperty, config: RequestConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      let val = config.request.query[property.name];

      if(val) {
        resolve(val);
      } else {
        if(property.optional) {
          resolve();
        } else if (property.defaultValue !== undefined) {
          resolve(property.defaultValue);
        } else {
          reject(new Response(400, `Required query parameter missing: ${property.name}`));
        }
      }
    });
  }

  /**
   * Resolves the param
   * 
   * @param  {IProperty}
   * @param  {RequestConfig}
   * @return {Promise<any>}
   */
  private static resolveParam(property: IProperty, config: RequestConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      let val = config.request.params[property.name];

      if(val) {
        resolve(val);
      } else {
        if(property.optional) {
          resolve();
        } else if(property.defaultValue !== undefined) {
          resolve(property.defaultValue);
        } else {
          reject(new Response(400, `Required parameter missing: ${property.name}`));
        }
      }
    });
  }

  /**
   * Resolves the header
   * 
   * @param  {IProperty}
   * @param  {RequestConfig}
   * @return {Promise<any>}
   */
  private static resolveHeader(property: IProperty, config: RequestConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      let val = config.request.header(property.name);

      if(val) {
        resolve(val);
      } else {
        if(property.optional) {
          resolve();
        } else if(property.defaultValue !== undefined) {
          resolve(property.defaultValue);
        } else {
          reject(new Response(400, `Required header missing: ${property.name}`));
        }
      }
    });
  }

  /**
   * Custom method for resolving auth properties
   * 
   * @param  {IProperty}
   * @param  {RequestConfig}
   * @return {Promise<any>}
   */
  public static resolveAuthentication(prop: IProperty, config: RequestConfig): Promise<any> {
    let name = prop.name;
    let authResource: IAuthHandler;

    if(name) {
      authResource = AuthManager.getHandlerByName(name);
    } else {
      authResource = AuthManager.getDefault();
    }
    

    let propertyValues = this.getProperties(authResource.object, authResource.method);
    return this.getPropertyValues(propertyValues, config).then((response: Response) => {
      if(response.type === ResponseType.Error) {
        return response;
      }

      return Promise.resolve(authResource.object[authResource.method].apply(authResource, response.data))
                .catch((response: any) => {
                  // If a Response wasn't returned, force a 401 response
                  if(!(response instanceof Response)) {
                    return new Response(401, response);
                  }
                });
    });
  }

  /**
   * Returns properties for ths given object.method
   * 
   * @param  {any}
   * @param  {string}
   * @return {IProperty[]}
   */
  public static getProperties(object: any, method: string): IProperty[] {
    let properties: IProperty[] = [];

    this.properties.forEach((property) => {
      if(property.object === object && property.method === method) {
        properties.push(property);
      }
    });

    return properties;
  }

  /**
   * Returns the property from the method with the given object.method name and type
   * 
   * @param {any}
   * @param {string}
   * @param {PropertyType}
   */
  public static getProperty(object: any, method: string, name: string, type: PropertyType) {
    let property: IProperty = null;

    this.properties.forEach((prop) => {
      if(prop.object === object && prop.method === method && prop.name === name && prop.type === type) {
        property = prop;
      }
    });

    return property;
  }
}