## Auth

A fair amount of routes require some sort of authentication. There needs to be a
context behind the request. For example, if the `GET => /userMessages` route is called,
we need to know which user is requesting their messages. This not only helps
us give context to the request but provides a basic level of security.

```typescript
import Route from 'expresskit/route';
import Auth from 'expresskit/auth';

export default class UserRouter {
  @Route('GET', '/user')
  public static getUserMessages(@Auth() user: User) {
    
  }
}
```

How is authentication described? This is up to the developer to implement using
the `@AuthHandler()` decorator. An Authentication Handler needs a name, in this case we'l name it 'User'. As most applications only have one Authentication Handler, we can set this as the default Authentication Handler by setting the optional second parameter of the decorator to `true`.

Authentication Handler resolvers can be injected with route properties like route methods. So in our userAuthentication method we can easily obtain the Authorization header.

```typescript
import AuthHandler from 'expresskit/auth/handler';
import Response from 'expresskit/route/response';
import {Header} from 'expresskit/property';

export default class User {
  public id: number;

  public username: string;

  public password: string;

  @AuthHandler('User', true)
  public static userAuthentication(@Header('Authorization') authorizationHeader: string): User {
    // use the authorization header to locate the correct user
    return new User();
    
    // or
    return new Promise.resolve(new User());
    
    // or
    return new Promise.reject(new Response(401, 'Not logged in'));
  }
}
```

Because this is the default Authentication Handler we can call it without naming it - `@Auth()`. If we had multiple Authentication Handlers, or wanted to be verbose, we can call other Handlers by passing the name in Auth- `@Auth('User')`.

You can "Fail" authentication by returning nothing, returning a rejected promise, or by
returning a `Response` with an error status. If authentication fails, and no `Response`
is given, the request will fail with a `401 Unauthenticated` error code.