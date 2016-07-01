import {ExpresskitServer} from './server';
import {ExpressRouter} from '../router';
import {Response} from '../route';

export class ExpressServer extends ExpresskitServer {
  constructor(express: any) {
    super();

    this.package = express;
    this.application = express();
    this.expresskitRouter = this.Router('/');
  }

  public Router(mount: string): ExpressRouter {
    let router = this.package.Router();

    return new ExpressRouter(mount, router);
  }

  public use(... args: any[]) {
    return this.expresskitRouter.router.use.apply(this.expresskitRouter.router, args);
  }

  public listen (... args: any[]) {
    return this.listenHandle = this.application.listen.apply(this.application, args);
  }

  public stop(... args: any[]) {
    return this.listenHandle.stop.apply(this.application, args);
  }

  public static (... args: any[]) {
    return this.expresskitRouter.router.static.apply(this.expresskitRouter.router, args);
  }

  public get (... args: any[]) {
    return this.expresskitRouter.router.get.apply(this.expresskitRouter.router, args);
  }
  
  public put (... args: any[]) {
    return this.expresskitRouter.router.put.apply(this.expresskitRouter.router, args);
  }

  public post (... args: any[]) {
    return this.expresskitRouter.router.post.apply(this.expresskitRouter.router, args);
  }

  public delete (... args: any[]) {
    return this.expresskitRouter.router.delete.apply(this.expresskitRouter.router, args);
  }

  public sendResponse(route: any, response: Response, expressResponse: any) {
    expressResponse.status(response.httpCode).send(response.data);
  }
}