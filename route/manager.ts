declare var require: any;
declare var __dirname: any;

import {IProperty, PropertyType} from '../property';
import {IStaticUriPath} from './static';
import RequestHandlerService from './requestHandler';
import AuthManager from '../auth/manager';
import fatal from '../error';

var express = require('express');
var path = require('path');

export type RouteMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface IRoute {
  method: RouteMethod;
  path: string;
  object: any;
  key: string;
  properties: IProperty[];
}

export default class RouteManager {
  public static routes: IRoute[] = [];

  /**
   * Registers a route to RouteManager.routes
   * @param {RouteMethod} method [description]
   * @param {string}      path   [description]
   * @param {Object}      object [description]
   * @param {string}      key    [description]
   */
  public static registerRoute(method: RouteMethod, path: string, object: any, key: string) {
    if(object.hasOwnProperty(key)) {
      let existingRoute = this.getRoute(method, path);
      if(!existingRoute) {
        this.routes.push({
          method: method,
          path: path,
          object: object,
          key: key,
          properties: object[key].properties || []
        });
      } else {
        let error = `Unable to register route: ${method} > ${path} to ${object.prototype.constructor.name}.${key}. This path is already registered to ${existingRoute.object.prototype.constructor.name}.${key}`;
        fatal(new Error(error));
      }
    } else {
      let error = `Unable to register route: ${method} > ${path} to ${object.prototype.constructor.name}.${key}. ${key} does not exist on ${object.prototype.constructor.name}. Instead of calling RouteManager.registerRoute directly, use the @Route decorator.`;
      fatal(new Error(error));
    }
  }

  public static registerRouteProperty(object: any, method: string, property: IProperty) {
    let properties: IProperty[] = object[method].properties = object[method].properties || [];
    let existingProperty = false;

    properties.forEach((prop) => {
      if(prop.type === property.type && prop.name === property.name) {
        existingProperty = true;
      }
    });

    if(!existingProperty) {
      properties.push(property);
    } else {
      let error = `Unable to register signature property: ${property.type} ${property.name} to ${object.prototype.constructor.name}.${method}. This Type/Name combination already exists on the route.`;
      fatal(new Error(error));
    }
  }

  /**
   * Binds the routes to the given express application
   * @param {any} application [description]
   */
  public static bindRoutes(application: any) {
    this.routes.forEach(route => {
      let expressMethod = this.getExpressMethod(application, route.method);
      expressMethod.call(application, route.path, RequestHandlerService.requestHandlerFactory(route));
    });
  }
  
  /**
   * Given the static paths, uses express.static to bind static paths
   */
  public static bindStaticPaths(application: any, staticPaths: IStaticUriPath[]) {
    staticPaths.forEach((path) => {
      application.use(path.uri, express.static(path.path));
    });
  }
  
  /**
   * Given the static paths, uses express.static to bind static paths
   */
  public static bindStaticFiles(application: any, staticPaths: IStaticUriPath[]) {
    staticPaths.forEach((p) => {
      application.get(p.uri, (req: any, res: any) => {
        res.sendFile(path.resolve(__dirname + '/' + p.path));
      });
    });
  }

  /**
   * Gets the route registered to [method] => path
   * @param {RouteMethod} method [description]
   * @param {string}      path   [description]
   */
  public static getRoute(method: RouteMethod, path: string) {
    let route: IRoute = null;

    this.routes.forEach((rt) => {
      if(rt.method === method && rt.path === path) {
        route = rt;
      }
    });

    return route;
  }

  /**
   * Gets the route registered to [object].[method]
   * @param {any}    object [description]
   * @param {string} method [description]
   */
  public static getRouteByClass(object: any, method: string) {
    let route: IRoute = null;

    this.routes.forEach((rt) => {
      if(rt.object === object && rt.key === method) {
        route = rt;
      }
    });

    return route;
  }

  /**
   * Returns the property from the route.properties given the type and name
   * @param {IRoute}            route [description]
   * @param {RoutePropertyType} type  [description]
   * @param {string}            name  [description]
   */
  public static getRouteProperty(route: IRoute, type: PropertyType, name: string) {
    let property: IProperty;

    route.properties.forEach((prop) => {
      if(prop.type === type && prop.name === name) {
        property = prop;
      }
    });

    return property;
  }

  /**
   * Given a RouteMethod, returns the express application method
   * @param  {RouteMethod} method [description]
   * @return {any}                [description]
   */
  private static getExpressMethod(application: any, method: RouteMethod): any {
    switch(method) {
      case 'GET':
        return application.get;
      case 'PUT':
        return application.put;
      case 'POST':
        return application.post;
      case 'DELETE':
        return application.delete;
    }

    return;
  }
}