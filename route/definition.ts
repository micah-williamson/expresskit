/// <reference path="../typings/tsd.d.ts"/> 

declare var require: any;
declare var __dirname: any;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression')

import ExpressKit from '../index';
import RouteResponse from './response';
import {Application, Request, Response, RequestHandler} from 'express';
import {MethodDecorator, IDecoratorConfig} from '../decorator';
import {DefinitionService, MethodDecoratorDefinitionService} from '../decorator/definition';
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

@DefinitionService()
export default class RouteDecoratorDefinitionService extends MethodDecoratorDefinitionService {
  public name = 'Route';
  
  // HACK: node doesn't supper `...args` yet
  constructor(){super();}
  
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
  
  /**
   * Setup middleware. Bind static files/paths
   */
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
    
    console.log(`[debug] Binding route ${config.routeMethod} => ${config.path}`);
    
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
  private requestHandlerFactory(methodDecorator: RouteDecorator): RequestHandler {
    return (request: Request, expressResponse: Response) => {
      let context = this.generateRequestContext(request);
      
      console.log(`[debug] Route requested [${methodDecorator.config.routeMethod}] => ${methodDecorator.config.path}`);
      
      return InjectionManager.callMethod(methodDecorator.object, methodDecorator.method, context).then((resolution: any) => {
        this.handleRouteResolution(expressResponse, resolution);
      }).catch((rejection: any) => {
        this.handleRouteRejection(expressResponse, rejection);
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
   * Handles a route rejection by sending the rejection with
   * a 500 error.
   */
  private handleRouteRejection(expressResponse: Response, rejection: any) {
    rejection = this.wrapRejection(rejection);
    expressResponse.status(rejection.status).send(rejection.data);
  }
  
  /**
   * Handles the resolution by sending the resolution with
   * a 200 response. If the resolution is empty, a 204 response is sent.
   */
  private handleRouteResolution(expressResponse: Response, resolution: any) {
    resolution = this.wrapResponse(resolution);
    expressResponse.status(resolution.status).send(resolution.data);
  }
  
  /**
   * Given the static paths, uses express.static to bind static paths
   */
  private bindStaticPaths(application: Application, staticPaths: IStaticUriPath[]) {
    staticPaths.forEach((path) => {
      
      console.log(`[debug] Binding static path ${path.uri} => ${__dirname}/${path.path}`);
      
      application.use(path.uri, express.static(path.path));
    });
  }
  
  /**
   * Given the static paths, uses express.static to bind static paths
   */
  private bindStaticFiles(application: Application, staticPaths: IStaticUriPath[]) {
    staticPaths.forEach((p) => {
      
      console.log(`[debug] Binding static file ${p.uri} => ${__dirname}/${p.path}`);
      
      application.get(p.uri, (req: any, res: any) => {
        res.sendFile(path.resolve(__dirname + '/' + p.path));
      });
    });
  }
  
  private wrapResponse(response: any): RouteResponse {
    if(response instanceof RouteResponse) {
      return response;
    } else if(response !== undefined) {
      response = new RouteResponse(200, response);
    } else {
      response = new RouteResponse(204, response); 
    }
    
    return response;
  }
  
  private wrapRejection(response: any): RouteResponse {
    if(response instanceof RouteResponse) {
      return response;
    } else if(response instanceof Error) {
      response = new RouteResponse(500, response.stack.toString());
    } else {
      response = new RouteResponse(500, response); 
    }
    
    return response;
  }
}