import {RouteMethod, RouteDecorator, IRouteConfig} from './manager';
import DecoratorManager from '../decorator/manager';

export default function Route(routeMethod: RouteMethod,
                              path: string) {
                                
  return function(object: any, method: string) {
    let config: IRouteConfig = {
      name: 'Route',
      routeMethod: routeMethod,
      path: path
    };
    
    DecoratorManager.registerMethodDecorator(object, method, config);
  }
  
}