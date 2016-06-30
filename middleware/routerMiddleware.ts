import {Reflect} from '../reflect';

import {RouteManager} from '../route/manager';

export function RouterMiddleware(method: any) {
  return function (object: any) {
    let middlewares = Reflect.getMetadata('Middlewares', object) || [];
    middlewares.push(method);

    Reflect.defineMetadata('Middlewares', middlewares, object); 
  }
}