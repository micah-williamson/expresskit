declare var required: any;

let PromiseChain = require('es6-promise-chain');

import {MethodDecoratorDefinitionService, MethodParamDecoratorDefinitionService} from '../decorator/definition';
import {IInjectionContext} from './index';
import DecoratorManager from '../decorator/manager';
import {MethodDecorator} from '../decorator';
import fatal from '../error';

export default class InjectionManager {
  
  public static async callMethod(object: any, method: string, context?: IInjectionContext): Promise<any[]> {
    context = context || {};
    
    return new Promise<any[]>((resolve, reject) => {
      let beforePromises: Promise<any>[] = [];
      let methodDecorators = DecoratorManager.getMethodDecoratorsFor(object, method);
      
      console.log(methodDecorators);
      // Do all before actions
      return PromiseChain.forEach(methodDecorators, (decorator: MethodDecorator) => {
        let service = <MethodDecoratorDefinitionService>DecoratorManager.getDecoratorDefinitionService(decorator.config.name);
        return service.onBefore(decorator, context);
      }).then(() => {
        console.log(methodDecorators);
        console.log('x');
        // Get injection properties
        return InjectionManager.resolveMethodParams(object, method, context).then((args) => {
          console.log('y');
          // Call original method
          return object[method].apply(object, args);
        }).then((resolution: any) => {
          console.log('z');
          console.log(methodDecorators);
          // Do all after actions
          return PromiseChain.forEach(methodDecorators, (decorator: MethodDecorator) => {
            console.log('r');
            let service = <MethodDecoratorDefinitionService>DecoratorManager.getDecoratorDefinitionService(decorator.config.name);
            return service.onAfter(decorator, context);
          });
        });
      }).then((response: any) => {
        console.log('res');
        console.log(response);
        resolve(response);
      }).catch((rejection: any) => {
        console.log('rej');
        console.log(rejection);
        reject(rejection);
      });
    });
  }

  /**
   * Resolves method params for the given object method.
   */
  public static async resolveMethodParams(object: any, method: string, context: IInjectionContext): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      let methodParamDecorators = DecoratorManager.getMethodParamsFor(object, method);
      
      methodParamDecorators.forEach((decorator) => {
        let service = <MethodParamDecoratorDefinitionService>DecoratorManager.getDecoratorDefinitionService(decorator.config.name);
        
        // Unshift- params resolve in reverse
        promises.unshift(service.resolve(decorator, context));
      });
      
      Promise.all(promises).then((args: any[]) => {
        resolve(args);
      }).catch((errs: any[]) => {
        reject(errs);
      });
    });
  }
}