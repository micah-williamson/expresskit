import ExpressKit from '../index';
import {default as Decorator, MethodParamDecorator} from './index';
import {IInjectionContext} from '../injection';
import DecoratorManager from './manager';
import fatal from '../error/index';

export interface IDecoratorDefinition {
  name: string;
}

export function DecoratorDefinition(name: string) {
  return function(object: any) {
    
  }
}

export abstract class DecoratorDefinitionService {
  public name: string;
  
  constructor() {
    DecoratorManager.registerDecoratorDefinitionService(this);
  }
  
  public onInstanceRegister(decorator: Decorator): void {};
  
  public onInstanceBeforeAppStart(decorator: Decorator): void {};
  
  public onInstanceAfterAppStart(decorator: Decorator): void {};
  
  public onBeforeAppStart(): void {};
  
  public onAfterAppStart(): void {};
  
  public fatal = fatal;
}

export abstract class MethodParamDecoratorDefinitionService extends DecoratorDefinitionService {
  public abstract async resolve(decorator: MethodParamDecorator, context: IInjectionContext): Promise<any>;
}