/// <reference path="../typings/tsd.d.ts"/> 

import {MethodParamDecorator, IDecoratorConfig} from '../decorator';
import {IRequestContext} from '../route/definition';
import {DefinitionService, MethodParamDecoratorDefinitionService} from '../decorator/definition';

export interface IQueryConfig extends IDecoratorConfig {
  queryName: string;
}

export class QueryDecorator extends MethodParamDecorator {
  config: IQueryConfig;
}

@DefinitionService()
export default class QueryDecoratorDefinitionService extends MethodParamDecoratorDefinitionService {
  public name = 'Query';
  
  // HACK: node doesn't supper `...args` yet
  constructor(){super();}
  
  public async resolve(decorator: QueryDecorator, context: IRequestContext): Promise<any> {
    return new Promise((resolve, reject) => {
      let queryValue = context.query[decorator.config.queryName];
      
      if(queryValue) {
        resolve(queryValue);
      } else {
        reject('Missing Required Query: ' + decorator.config.queryName);
      }
    });
  }
}