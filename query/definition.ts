/// <reference path="../typings/tsd.d.ts"/> 

import {MethodParamDecorator, IDecoratorConfig} from '../decorator';
import {IRequestContext} from '../route/manager';
import {MethodParamDecoratorDefinitionService} from '../decorator/definition';

export interface IQueryConfig extends IDecoratorConfig {
  queryName: string;
}

export class QueryDecorator extends MethodParamDecorator {
  config: IQueryConfig;
}

export default class QueryDecoratorDefinitionService extends MethodParamDecoratorDefinitionService {
  public name = 'Query';
  
  public async resolve(decorator: QueryDecorator, context: IRequestContext): Promise<any> {
    return new Promise((resolve, reject) => {
      let queryValue = context.query[decorator.config.queryName];
      
      if(queryValue) {
        resolve(queryValue);
      } else {
        reject();
      }
    });
  }
}