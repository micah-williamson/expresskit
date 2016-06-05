/// <reference path="../typings/tsd.d.ts"/> 

import {HeaderDecorator} from './index';
import {IRequestContext} from '../route/definition';
import {DefinitionService, MethodParamDecoratorDefinitionService} from '../decorator/definition';

@DefinitionService()
export default class HeaderDecoratorDefinitionService extends MethodParamDecoratorDefinitionService {
  public name = 'Header';
  
  // HACK: node doesn't supper `...args` yet
  constructor(){super();}
  
  public async resolve(decorator: HeaderDecorator, context: IRequestContext): Promise<any> {
    return new Promise((resolve, reject) => {
      let headerValue = context.request.header(decorator.config.headerName);
      
      if(headerValue) {
        resolve(headerValue);
      } else {
        reject('Missing Required Header: ' + decorator.config.headerName);
      }
    });
  }
}