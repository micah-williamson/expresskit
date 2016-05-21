import RouteManager from './manager';

export default function Route(method: 'GET' | 'POST' | 'PUT' | 'DELETE',
                              path: string) {
  return function(obj: any, key: string) {
    RouteManager.registerRoute(method, path, obj, key);
  }
}