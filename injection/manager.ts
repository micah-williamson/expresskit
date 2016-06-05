import {MethodParamDecoratorDefinitionService} from '../decorator/definition';
import {IInjectionContext} from './index';
import DecoratorManager from '../decorator/manager';
import fatal from '../error';

export default class InjectionManager {

  /**
   * Resolves method params for the given object method.
   */
  public static async resolveMethodParams(object: any, method: string, context: IInjectionContext): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      let promises: Promise<any>[] = [];
      let methodParamDecorators = DecoratorManager.getMethodParamsFor(object, method);
      
      methodParamDecorators.forEach((decorator) => {
        let service = <MethodParamDecoratorDefinitionService>DecoratorManager.getDecoratorDefinitionService(decorator.config.name);
        promises.push(service.resolve(decorator, context));
      });
      
      return Promise.all(promises);
    });
  }
}