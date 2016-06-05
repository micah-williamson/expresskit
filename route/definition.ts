/// <reference path="../typings/tsd.d.ts"/> 

declare var require: any;
declare var __dirname: any;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression')

import ExpressKit from '../index';
import {Application} from 'express';
import {MethodDecorator, IDecoratorConfig} from '../decorator';
import {DecoratorDefinitionService} from '../decorator/definition';
import DecoratorManager from '../decorator/manager';
import {IInjectionContext} from '../injection';
import InjectionManager from '../injection/manager';

export type RouteMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface IRouteConfig extends IDecoratorConfig {
  routeMethod: RouteMethod;
  
  path: string;
}

export class RouteDecorator extends MethodDecorator {
  config: IRouteConfig;
}

export interface IRequestContext extends IInjectionContext {
  request: any;
  url: string;
  params: any;
  query: any;
}

export interface IStaticUriPath {
  uri: string,
  path: string
}

export default class RouteDecoratorDefinitionService extends DecoratorDefinitionService {
  public name = 'Route';
  
  /**
   * Be sure no routes share the same [routeMethod] => [path]
   */
  public onInstanceRegister(decorator: RouteDecorator) {
    let object = decorator.object;
    let method = decorator.method;
    let config = decorator.config;
    let routeMethod = config.routeMethod;
    let path = config.path;
    
    let existingRoute = this.getRoute(routeMethod, path);
    if(existingRoute) {
      let error = `Unable to register route: ${routeMethod} > ${path} to ${object.prototype.constructor.name}.${method}. This path is already registered to ${existingRoute.object.prototype.constructor.name}.${existingRoute.method}`;
      this.fatal(new Error(error));
    }
    
    this.bindRoute(decorator);
  }
  
  public onBeforeAppStart() {
    if(ExpressKit.config.compression) {
      ExpressKit.server.use(compression());
    }
    
    ExpressKit.server.use(bodyParser.json({ type: 'application/json' }));
    ExpressKit.server.use(bodyParser.urlencoded({extended: true}));
    ExpressKit.server.use(bodyParser.text());
    ExpressKit.server.use(bodyParser.raw());
    
    this.bindStaticFiles(ExpressKit.server, ExpressKit.config.staticFiles);
    this.bindStaticPaths(ExpressKit.server, ExpressKit.config.staticPaths);
  }
  
  /**
   * Binds the route decorator to express
   */
  private bindRoute(decorator: RouteDecorator) {
    let config = decorator.config;
    let expressMethod = this.getExpressMethod(ExpressKit.server, config.routeMethod);
    expressMethod.call(ExpressKit.server, config.path, this.requestHandlerFactory(decorator));
  }
  
  /**
   * Returns the route decorator by the given routeMethod and path.
   * If not found, returns null.
   */
  private getRoute(routeMethod: RouteMethod, path: string): RouteDecorator {
    let decorators = <RouteDecorator[]>DecoratorManager.getDecoratorsByName(this.name);
    for(var i = 0; i < decorators.length; i++) {
      let decorator = decorators[i];
      if(decorator.config.routeMethod === routeMethod && decorator.config.path === path) {
        return decorator
      }
    }
    
    return null;
  }
  
  /**
   * Given a RouteMethod, returns the express application method
   * @param  {RouteMethod} method [description]
   * @return {any}                [description]
   */
  private getExpressMethod(application: Application, method: RouteMethod): any {
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
  
  /**
   * @description Returns a generic request config given the request
   * @param {any} request [description]
   */
  private generateRequestContext(request: any): IRequestContext {
    return {
      request: request,
      url: request.path,
      params: request.params,
      query: request.query
    };
  }

  /**
   * @description Returns a route handler
   * @param {IRoute} route [description]
   */
  private requestHandlerFactory(methodDecorator: MethodDecorator): any {
    return (request: any, expressResponse: any) => {
      let context = this.generateRequestContext(request);
      
      InjectionManager.resolveMethodParams(methodDecorator.object, methodDecorator.method, context).then((args) => {
        methodDecorator.object[methodDecorator.method].apply(methodDecorator.object, args);
      });
      
      /*let config = this.generateRequestConfig(request);
      let rules = RuleManager.getRules(route.object, route.key);
      
      if(rules.length) {
        this.verifyRules(rules, config).then(() => {
          this.runMethod(route, config, expressResponse);
        }).catch((response) => {
          ResponseHandler.handleResponse(route, expressResponse, response);
        });
      } else {
        this.runMethod(route, config, expressResponse);
      }*/
    }
  }
  
  /**
   * Given the static paths, uses express.static to bind static paths
   */
  private bindStaticPaths(application: Application, staticPaths: IStaticUriPath[]) {
    staticPaths.forEach((path) => {
      application.use(path.uri, express.static(path.path));
    });
  }
  
  /**
   * Given the static paths, uses express.static to bind static paths
   */
  private bindStaticFiles(application: Application, staticPaths: IStaticUriPath[]) {
    staticPaths.forEach((p) => {
      application.get(p.uri, (req: any, res: any) => {
        res.sendFile(path.resolve(__dirname + '/' + p.path));
      });
    });
  }
}