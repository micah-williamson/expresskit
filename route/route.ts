import {RouteManager} from './manager';

export function Route(method: 'GET' | 'POST' | 'PUT' | 'DELETE',
                              path: string) {
  return function(obj: any, key: string) {
    if(path[0] === '/') {
      path = path.substr(1);
    }
    RouteManager.registerRoute(method, path, obj, key);
  }
}