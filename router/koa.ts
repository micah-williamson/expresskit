import {Reflect} from '../reflect';

import {ExpresskitRouter} from './router';
import {IRoute, Response, ResponseService} from '../route';
import {RuleService} from '../rule/service';
import {InjectorService} from '../injector/service';
import {DTOManager} from '../dto';

export class KoaRouter extends ExpresskitRouter {
  public bindSelf(parent: ExpresskitRouter) {
    if(parent.mount) {
      console.log(this.mount);
      parent.router.use(this.mount, this.router.routes());
    } else {
      parent.use(this.router.routes());
    }
  }
  
  public use(... args: any[]) {
    return this.router.use.apply(this.router, args);  
  }
  
  public static (... args: any[]) {
    return this.router.static.apply(this.router, args);
  }

  public get (... args: any[]) {
    return this.router.get.apply(this.router, args);    
  }
  
  public put (... args: any[]) {
    return this.router.put.apply(this.router, args);
  }

  public post (... args: any[]) {
    return this.router.post.apply(this.router, args);
  }

  public delete (... args: any[]) {
    return this.router.delete.apply(this.router, args);
  }
}