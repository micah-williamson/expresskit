import {InjectorService, IInjectable, IInjectionConfig, IInjectionResolver} from 'restkit/injector';
import {Response} from 'restkit/route';
import {DTOManager} from 'restkit/dto';

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

  public resolve(injectable: IInjectable, request: any): Promise<any> {
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