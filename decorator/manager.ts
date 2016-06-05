import {default as Decorator, MethodDecorator, MethodParamDecorator, PropertyDecorator, IDecoratorConfig} from './index';
import {DecoratorDefinitionService} from './definition';
import fatal from '../error';

interface IDecoratorDefinitionServiceMap {
  [key: string]: DecoratorDefinitionService;
}

export default class DecoratorManager {
  public static decoratorDefinitionServices: IDecoratorDefinitionServiceMap = {};
  
  public static decorators: Decorator[] = [];
  
  public static methodDecorators: MethodDecorator[] = [];
  
  public static methodParamDecorators: MethodParamDecorator[] = [];
  
  public static propertyDecorators: PropertyDecorator[] = [];
  
  /**
   * Registers a method decorator
   */
  public static registerMethodDecorator(object: any, method: string, config: IDecoratorConfig) {
    let decorator = new MethodDecorator(object, method, config);
    
    this.verifyMethod(object, method, config);
    this.verifyMatchingDefinitionService(object, method, config);
    
    let service = this.getDecoratorDefinitionService(config.name);
    service.onInstanceRegister(decorator);
    
    this.methodDecorators.push(decorator);
    this.decorators.push(decorator);
  }
  
  /**
   * Registers a method param decorator
   */
  public static registerParamDecorator(object: any, method: string, index: number, config: IDecoratorConfig) {
    let decorator = new MethodParamDecorator(object, method, index, config);
    
    this.verifyMethod(object, method, config);
    this.verifyMatchingDefinitionService(object, method, config);
    
    let service = this.getDecoratorDefinitionService(config.name);
    service.onInstanceRegister(decorator);
    
    this.methodParamDecorators.push(decorator);
    this.decorators.push(decorator);
  }
  
  /**
   * Registers the given DecoratorDefinitionService by its name property.
   */
  public static registerDecoratorDefinitionService(service: DecoratorDefinitionService) {
    let name = service.name;
    this.verifyUniqueDecoratorDefinitionServiceName(service);
    
    this.decoratorDefinitionServices[name] = service;
  }
  
  /**
   * Kills the application if the method does not exist on the object given.
   * This will likely occur from improper decorator definition implementation.
   * If the decorator definition is implemented correctly and the method decorator is being used,
   *    the user should not encounter this error.
   */
  public static verifyMethod(object: any, method: string, config: IDecoratorConfig) {
    if(!object[method]) {
      let error = `Implementation Error. Unable to register ${config.name} decorator on ${object.prototype.constructor.name}.${method}. Static method ${method} does not exist on ${object.prototype.constructor.name}.`;
      fatal(new Error(error));
    }
  }
  
  /**
   * Kills the application if the decorator config's name cannot be matched to a DecoratorDefinitionService.
   * This will occur from improper decorator definition implementation.
   */
  public static verifyMatchingDefinitionService(object: any, method: string, config: IDecoratorConfig) {
    if(!this.decoratorDefinitionServices[config.name]) {
      let error = `Implementation Error. Unable to register ${config.name} decorator on ${object.prototype.constructor.name}.${method}. The decorator config name '${config.name}' couldn't be matched to a DecoratorDefinitionService. Make sure the name property on the config and the service match.`;
      fatal(new Error(error));
    }
  }

  /**
   * Kills the application if multiple decorator definition services attempt to register by the same name.
   */
  public static verifyUniqueDecoratorDefinitionServiceName(service: DecoratorDefinitionService) {
    let existingDefinitionService = this.getDecoratorDefinitionService(service.name);
    if(existingDefinitionService) {
      let error = `Implementation Error. Unable to register ${service.name} DecoratorDefinitionService on ${(<any>service).prototype.constructor.name}. A DecoratorDefinitionService by this name already exists on ${(<any>existingDefinitionService).prototype.constructor.name}.`;
      fatal(new Error(error));
    }
  }
  
  /**
   * Returns the DecoratorDefinitionService by this name. If none are found, NULL is returned.
   */
  public static getDecoratorDefinitionService(name: string): DecoratorDefinitionService {
    return this.decoratorDefinitionServices[name] || null;
  }
  
  /**
   * Returns the registered decorators by the given config name
   */
  public static getDecoratorsByName(name: string): Decorator[] {
    let decorators: Decorator[] = [];
    
    this.decorators.forEach((decorator) => {
      if(decorator.config.name === name) {
        decorators.push(decorator);
      }
    });
    
    return decorators;
  }
  
  /**
   * Returns method params for the given object/method
   */
  public static getMethodParamsFor(object: any, method: string): MethodParamDecorator[] {
    let methodParamDecorators: MethodParamDecorator[] = [];
    
    this.methodParamDecorators.forEach((decorator) => {
      if(decorator.object === object && decorator.method === method) {
        methodParamDecorators.push(decorator);
      }
    });
    
    return methodParamDecorators;
  }
}

