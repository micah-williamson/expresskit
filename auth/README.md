Auth
----


Auth behaves by resolving some sort of authorization value for the route. Because
it could be used to generically resolve anything, Auth will eventually become `Resolution`.
However, the behavior will largely remain the same. 

**Auth** (In the future: Resolutions)

[Authentication not Authorization](#authenticationnotauthorization)

[Auth and AuthHandler](#auth)

<a name="authenticationnotauthorization"></a>
## Authentication, not Authorization

Keep in mind that Authentication and Authorization are different. When you are
Authenticating a request you are finding the identity of the user behind that
request. When a user logs in, they can use an access token to authenticate future
requests, but there may be some operation that they are unable to perform as that
user.

Once you have Authenticated a request, see [Rules](/rules) to provide
Authorization.

<a name="auth"></a>
## Auth and AuthHandler

The `Auth` decorator is used to resolve the authentication resource for a request.
We will need to write a method that provides that resolution, so that's where we'l
begin.

An `AuthHandler` decorator can be used to define a method used to resolve the `Auth`
resource. Our handler method is an `injectable` method that can inject contextual
properties from the route. Because of this, we can use decorators like `Header` to
get the Authorization header of the request.

```typescript
import {AuthHandler} from 'expresskit/auth';
import {Header} from 'expresskit/property';

export class AuthService {
  @AuthHandler('User')
  public static resolveAuth(@Header('Authorization') auth: string) {
    // Do some sort of authenticating here and return the resource
    return {userId: 1, token: auth};
  }
}
```

This handler will (ideally) use the Authorization header to authenticate the request,
and return some information about *who* is making the request. With this we can now
use the `Auth` decorator to authenticate our routes.

```typescript
import {Auth} from 'expresskit/auth';
import {Route} from 'expresskit/route';

// Make sure the compiler knows to include this at some point since we don't
// directly call any methods on AuthService
import './auth.service.ts';

export class UserRouter {

  @Route('PUT', '/user')
  public static updateUser(@Auth('User') auth: any, @Body() update: any) {
    if(auth.userId === update.userId) {
      // Do update
    }
  }

}

```

## Keep Reading

[Routing](/route/README.md)

[Middleware](/middleware/README.md)

[Auth](/auth/README.md)

[Rules](/rule/README.md)

[DTOs](/dto/README.md)

## More Links

[Expresskit Seed Project]()

[Github](https://github.com/iamchairs/expresskit)

[Issues](https://github.com/iamchairs/expresskit/issues)

[NPM](https://www.npmjs.com/package/expresskit)

[Twitter](https://twitter.com/micahwllmsn)