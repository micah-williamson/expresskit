/// <reference path="../typings/tsd.d.ts"/> 
import {IDecoratorConfig, MethodParamDecorator} from '../decorator';
import {IRequestContext} from '../route/definition';
import {DefinitionService, MethodParamDecoratorDefinitionService} from '../decorator/definition';


export interface IParamConfig extends IDecoratorConfig {
  paramName: string;
}

export class ParamDecorator extends MethodParamDecorator {
  config: IParamConfig;
}

@DefinitionService()
export default class ParamDecoratorDefinitionService extends MethodParamDecoratorDefinitionService {
  public name = 'Param';
  
  // HACK: node doesn't supper `...args` yet
  constructor(){super();}
  
  public async resolve(decorator: ParamDecorator, context: IRequestContext): Promise<any> {
    return new Promise((resolve, reject) => {
      let paramValue = context.params[decorator.config.paramName];
      
      if(paramValue) {
        resolve(paramValue);
      } else {
        reject('Missing Required Param: ' + decorator.config.paramName);
      }
    });
  }
}