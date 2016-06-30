import {Request as ExpressRequest} from 'express';

import {InjectorService} from '../injector/service';
import {IInjectable, IInjectionConfig, IInjectionResolver} from '../injector';
import {Response} from '../route';
import {DTOManager} from '../dto/manager';

export function Body(dto?: Object) {
  return function(object: any, method: string, index: number) {
    let injectable: IInjectable = {
      index: index,
      arguments: [dto]
    };

    let injectionConfig: IInjectionConfig = {
      injectionResolver: new BodyInjectionResolver(),
      injectable: injectable
    };

    InjectorService.registerInjection(object, method, injectionConfig);
  }
}

export class BodyInjectionResolver implements IInjectionResolver {

  public resolve(injectable: IInjectable, request: ExpressRequest): Promise<any> {
    let dto = injectable.arguments[0];

    let body = request.body;

    if(dto) {
      if(body) {
        DTOManager.scrubIn(body, dto);
        let err = DTOManager.validate(body, dto);
        
        if(err) {
          return Promise.reject(new Response(400, err));
        }
      } else {
        return Promise.reject(new Response(400, 'Body expected')); 
      }
    }
    
    return Promise.resolve(body);
  }

}