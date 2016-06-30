Routing
-------

[The Basics](#thebasics)

[Asynchronous Requests](#async)

[Expresskit Response](#response)

[Injectables](#injectables)

## The Basics

Under the hood, Expresskit is using Express for routing. So where an Expresskit route
is defined it will get bound to an Express application, letting us use features and
hardwork Express has already given us

To define a route you will need to use the `@Route` decorator which can be imported
from `expresskit/route`. A Route is defined by the http method, and uri. We will setup
a UserRouter that handles CRUD operations. Below we'l show what the setup for a GET,
PUT, POST, and DELETE route.

```
/
  index.ts
  user/
    router.ts <-- Here
```

```typescript
import Route from 'expresskit/route';

export default class UserRouter {
  @Route('GET', '/user/:id')
  public static getUser(): Object {
    return {};
  }

  @Route('PUT', '/user')
  public static updateUser(): string {
    return 'User Updated';
  }

  @Route('POST', '/user')
  public static addUser(): void {
    return;
  }

  @Route('DELETE', '/user')
  public static deleteUser(): string {
    return 'User Deleted';
  }
}
```

When a route requested, these method will get called. The route method can handle the
request directly or use other services to help resolve the request. It is recommended
to keep routes inside of routers, and keep your routers thin. Treat your router like
a Controller.

You may have noticed the router methods are static, this is for our convenience. Since
the router and most services are stateless or act in some global capacity, static classes
and method make sense here.

<a name="async"></a>
## Asynchronous Requests

Asynchronous requests are supported with promises. When a promise is returned Expresskit
will wait for the promise to be resolved or rejected before responding to the client.


```typescript
@Route('GET', '/user:id')
public static getUser(): Promise<Object> {
  return new Promise((resolve, reject) => {
    // Do something asynchronous

    // On success:
    resolve({});

    // On fail:
    reject('Something went wrong');
  });
}
```

<a name="response"></a>
## Expresskit Response

Expresskit can handle responses in different ways. We've already seen it can handle
returning values directly, and resolving values, but there are two more we should
look at.

The first is **Thrown Errors**, this may be obvious to someone familiar
with promises as a thrown error rejects the promise. However, the way a thrown error
is handled is to send the stack trace to the client. In other words, don't use
error throwing as a substitution for route rejection.

The second is the `Expresskit Response`. This response is an object containing
the `http status code` and data payload. This can be returned or resolved at any
time and has the benefit of giving you control over the returned http statuc code.
Here is an example of how they are used-

If that seems a little heavy handed, there will be more options in the future in the
form of decorators. When an Expresskit Response is not used a default status code is
used:

**200** - Is the default for any resolved/returned request with a payload.

**204** - Is the default for any resolved/returned request without a payload.

**400** - Is the default for any request that has missing required `injectables`
          or fails `DTO` validation.

**401** - Is the default for any request that fails to resolve `authentication`.

**500** - Is the default for any rejected request including `rules`.

<a name="injectables"></a>
## Injectables

With vanilla Express you are given the request and the response. In Expresskit routes
your don't have access to the response and should only use the request if working with
not-yet-supported 3rd party middleware. More on that in the `Middleware` section.
Instead you inject the properties of a request you want to use. Injectables are an
important part of Expresskit and one of the primary reasons for it's existance.
There are four basic injectables, `Param`, `Query`, `Body`, and `Header`. To use
them, you can decorator parameters in the method.

```typescript
import {Route} from 'expresskit/route';
import {Param, Query, Body, Header} from 'expresskit/property';

@Route('GET', '/user/search/:page')
public static searchUsers(@Param('page') page: number, @Query('q') search: string): Promise<Object> {
  console.log('On page: ' + page);
  console.log('Search term: ' + search);
}

@Route('PUT', '/user')
public static updateUser(@Header('Authorization') auth: string, @Body(): update: any) {
  if(auth === update.id) {
    // not secure. dont actually do this
  }
}
```

`Params` should match the correspending param in the route uri: `:page` matches `page` and
becomes available in the page variable.

`Query` params don't need to be defined in the route uri. When `/user/search/1?q=foo`
is requested, `foo` will be available in the search variable.

`Header` is pulled from the request header. In update, the Authorization header is
expected.

`Body` is payload of the request (sent by `PUT` and `POST` requests). If the payload
is JSON this will be a parsed JSON object.

All injectables except `Body` are **required** by default. When the route is requested,
if it cannot resolved the property from the request, it will respond with a 400 error
and a message similar to-


>  Required query parameter missing: q


`Query` and `Header` params can be made conditional by appending `?` to the name.

```typescript
public static conditionalProperties(@Header('Authorization?') auth: string, @Query('q?') q: string) {
  // Optional Header and Query
}
```

Alternatively, using `=`, a default value can be given if they aren't present in the request.

```typescript
public static conditionalProperties(@Header('Authorization=foo') auth: string, @Query('q=bar') q: string) {
  // Optional Header and Query
}
```

Injectables will be referenced in other sections of the Expresskit README and aren't
limited to just Routes. In fact, other sections may introduce injectables of there
own.

<a name="router"></a>
## Routers

Defining a your router class as a `Router` isn't strictly necessary as this time.
But it can help you cleanup your paths and in some cases cleanup redundancies (see
Middleware). By defining a router you can set the `base path` for the routes defined
in the router class.

```typescript
import {Route, Router} from 'expresskit/route';

@Router('/user')
export class UserRouter {
  // GET => /user/:id
  @Route('GET', '/:id')
  public static getUser() {}

  // POST => /user/:id
  @Route('POST', '/')
  public static createUser() {}

  // PUT => /user/:id
  @Route('PUT', '/')
  public static updateUser() {}

  // DELETE => /user/:id
  @Route('DELETE', '/')
  public static deleteUser() {}
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