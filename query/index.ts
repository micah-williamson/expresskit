import {IQueryConfig} from './definition';
import DecoratorManager from '../decorator/manager';

export default function Query(name: string) {
                                
  return function(object: any, method: string, index: number) {
    let config: IQueryConfig = {
      name: 'Query',
      queryName: name
    };
    
    DecoratorManager.registerParamDecorator(object, method, index, config);
  }
  
}