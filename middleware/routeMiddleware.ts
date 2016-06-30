import {Reflect} from '../reflect';

export function RouteMiddleware(middleware: any) {
  return function (object: any, method: any) {
    let middlewares = Reflect.getMetadata('Middlewares', object, method) || [];
    middlewares.push(middleware);

    Reflect.defineMetadata('Middlewares', middlewares, object, method);
  }
}