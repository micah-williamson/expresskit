import {MethodParamDecorator, IDecoratorConfig} from '../decorator';
import DecoratorManager from '../decorator/manager';

export interface IHeaderConfig extends IDecoratorConfig {
  headerName: string;
}

export class HeaderDecorator extends MethodParamDecorator {
  config: IHeaderConfig;
}


export default function Header(name: string) {
                                
  return function(object: any, method: string, index: number) {
    let config: IHeaderConfig = {
      name: 'Header',
      headerName: name
    };
    
    DecoratorManager.registerParamDecorator(object, method, index, config);
  }
  
}