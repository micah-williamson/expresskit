import {Reflect} from '../reflect';

import {Response} from '../route/response';

export interface IRuleResolver {
  (... val: any[]): Promise<any | Response>;
} 

export type IRuleResolverTree = Array<Array<IRuleResolver>>;

export function Rule(... resolvers: IRuleResolver[]) {
  return function(object: any, method: string) {
    let rules = Reflect.getMetadata('Rules', object, method) || [];
    rules.push(resolvers);

    Reflect.defineMetadata('Rules', rules, object, method);
  }
}