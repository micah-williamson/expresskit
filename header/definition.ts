/// <reference path="../typings/tsd.d.ts"/> 

import {HeaderDecorator} from './index';
import {IRequestContext} from '../route/manager';
import {MethodParamDecoratorDefinitionService} from '../decorator/definition';

export default class HeaderDecoratorDefinitionService extends MethodParamDecoratorDefinitionService {
  public name = 'Header';
  
  public async resolve(decorator: HeaderDecorator, context: IRequestContext): Promise<any> {
    return new Promise((resolve, reject) => {
      let headerValue = context.query[decorator.config.headerName];
      
      if(headerValue) {
        resolve(headerValue);
      } else {
        reject();
      }
    });
  }
}