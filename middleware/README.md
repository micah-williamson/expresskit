Middleware
----------

A late addition to the party, `Middleware` is an important feature of vanilla Express that
provides 3rd party plugins for your server application. It works by chaining operations
through a `next` callback before finally hitting your route function.

> [Middleware] -> [Middleware] -> [Middleware] -> [Your Route]

This doesn't work any differently with Expresskit. The `[Your Route]` in this process
is the point point where the Expresskit request handler takes control.

> [Middleware] -> [Middleware] -> [Request Handler] -> [Your Route] -> [Response Handler]

You can add middleware to a `Route` or a `Router`.

[Route](#route)

[Router](#router)

<a name="route"></a>
## RouteMiddleware

To add middleware to a Route use the `RouteMiddleware` decorator.
Using the [cookie-parser example](http://expressjs.com/en/guide/using-middleware.html#middleware.third-party)
from the Express site, we need to pass the middleware function to the decorator.

```typescript
declare let require: any;

import {Route} from 'expresskit/route';
import {RouteMiddleware} from 'expresskit/middleware';

let cookieParser = require('cookie-parser');

export class UserRouter {
  @Route('GET', '/user/:id')
  @RouteMiddleware(cookieParser())
  public static getUser() {}
}
```

The cookie-parser middleware adds cookies to the request object. At the time of
writing this, `@Cookie` is not available as an injectable. In this case we can
use the `@Context` decorator to get the the express request and use this middleware.

```typescript
import {Context} from 'expresskit/property';

export class UserRouter {
  @Route('GET', '/user/:id')
  @RouteMiddleware(cookieParser())
  public static getUser(@Context() req: any) {
    console.log(req.cookies);
  }
}
```

<a name="router"></a>
## RouterMiddleware

To add middleware to a collection of routes you can add it to the Router itself.
To add middleware to a route use the `RouteMiddleware` decorator. Keep in mind that
for this to work your router must be declared as such using the `Router` decorator
mentioned in the [Router](/routing/#router) section of the routes README.

```typescript
declare let require: any;

import {Route} from 'expresskit/route';
import {Context} from 'expresskit/property';
import {RouterMiddleware} from 'expresskit/middleware';

let cookieParser = require('cookie-parser');

@Router('/user')
@RouterMiddleware(cookieParser())
export class UserRouter {

  @Route('GET', '/:id')
  public static getUser(@Context() req: any) {
    console.log(req.cookies);
  }

  @Route('PUT', '/')
  public static updateUser(@Context() req: any) {
    console.log(req.cookies);
  }

}
```

## Keep Reading

[Routing](route/README.md)

[Middleware](middleware/README.md)

[Auth](auth/README.md)

[Rules](rule/README.md)

[DTOs](dto/README.md)

## More Links

[Expresskit Seed Project]()

[Github](https://github.com/iamchairs/expresskit)

[Issues](https://github.com/iamchairs/expresskit/issues)

[NPM](https://www.npmjs.com/package/expresskit)

[Twitter](https://twitter.com/micahwllmsn)