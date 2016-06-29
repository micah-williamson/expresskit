import {RouteManager} from './manager';

export function Router(mount: string) {
  return function(object: any) {
    RouteManager.registerRouter(object, mount);
  }
}