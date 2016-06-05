import ExpressKit from '../index';
import {Decorator, MethodDecorator, MethodParamDecorator} from './index';
import {IInjectionContext} from '../injection';
import DecoratorManager from './manager';
import fatal from '../error/index';

export interface IDecoratorDefinition {
  name: string;
}

export function DefinitionService() {
  return function(object: typeof DecoratorDefinitionService) {
    let service = new object();
    
    console.log('[debug] Registering Decorator Definition: ' + service.name);
    
    DecoratorManager.registerDecoratorDefinitionService(service);
  }
}

export class DecoratorDefinitionService {
  public name: string;
  
  public onInstanceRegister(decorator: Decorator): void {};
  
  public onInstanceBeforeAppStart(decorator: Decorator): void {};
  
  public onInstanceAfterAppStart(decorator: Decorator): void {};
  
  public onBeforeAppStart(): void {};
  
  public onAfterAppStart(): void {};
  
  public fatal = fatal;
}

export class MethodDecoratorDefinitionService extends DecoratorDefinitionService {
  public async onBefore(decorator: MethodDecorator, context: IInjectionContext): Promise<any> {}
  public async onAfter(decorator: MethodDecorator, context: IInjectionContext): Promise<any> {}
}

export class MethodParamDecoratorDefinitionService extends DecoratorDefinitionService {
  public async resolve(decorator: MethodParamDecorator, context: IInjectionContext): Promise<any> {};
}