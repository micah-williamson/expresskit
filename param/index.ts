import {IParamConfig} from './definition';
import DecoratorManager from '../decorator/manager';

export default function Param(name: string) {
                                
  return function(object: any, method: string, index: number) {
    let config: IParamConfig = {
      name: 'Param',
      paramName: name
    };
    
    DecoratorManager.registerParamDecorator(object, method, index, config);
  }
  
}