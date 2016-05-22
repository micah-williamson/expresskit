expresskit
==========

This is an experimental node rest server library using decorators.
Developers using Java and C# frameworks are familiar with annotations when writing restful services.
`expresskit` is an attempt to bring some of those useful annotations to node rest servers.

### Prerequisites

`Typescript ~1.8.0`

### Install

```
npm install --save expresskit
```

### tsconfig

```json
{
    "compilerOptions": {
        "target": "es6",
        "module": "system",
        "moduleResolution": "node",
        "declaration": false,
        "noImplicitAny": true,
        "removeComments": true,
        "noLib": false,
        "outDir": "bld",
        "experimentalDecorators": true
    },
    "files": [
        "index.ts"
    ]
}
```

### Start

```
/
  index.ts <-- Here
  /user
    router.ts
```

```typescript
import ExpressKit from 'expresskit';
import 'user/router';

ExpressKit.start();
```

#### Start Config

There are a few configurable properties when you start the server.
See the properties below and their default values-

```typescript
import ExpressKit from 'expresskit';
import 'user/router';

ExpressKit.start({
  port: 80, // default: 8000
  compression: true, // default: false
  timezone: 'Z', // default: Z (GMT 0)
  staticFiles: [
   {uri: '/', path: 'client/index.html'} 
  ], // default: []
  staticPaths: [
   {uri: '/assets', path: 'client/assets/'}, 
  ] // default: []
});
```

### Build and Run

It is recommended that you create a `build.sh` script for this. But
in these early stages of typescript and node, building requires a few
steps. Everything must be built to a single file next to your `index.ts`
source file. The reason is because typescript will also build the
expresskit source. If you are building with commonjs then the expresskit
node_modules directory will get build to your build directory. And
in places where expresskit uses node `require` it will not be able
to find the other node modules.

Here is an example of my `build.sh` script using systemjs.

```
tsc
build=`cat "build.js"`
echo "var System = require('systemjs');" "$build" > "build.js";
echo "System.import('index');" >> "build.js";
```

Then you can run the build file.

```
node build.js
```

> Started server on port 8000

# Routing

```
/
  index.ts
  user/
    router.ts <-- Here
```

To create a route you should use the `@Route` decorator.
What route methods return directly is treated as the response.
This makes simple routes without asynchronous processes easy to
write without a lot of overhead. If your method is asynchronous -
and it likely is - you can return a `promise`. What is resolved
by that promise is treated as the response. When a promise is **resolved**,
the client will recieve a `200` response by default and a `204`
response if no data was resolved with the promise. If a promise is
**rejected**, the server will respond with a `500` error by default.

If you need more control over the `status codes` being returned,
you can return a `Response` object (see addUser below). Keep in
mind when handling errors, the only way to return an error without
a promise is to return a Response. Additionally, the promises doesn't
*need* to be rejected if you are resolving a Response with an
error code.

```typescript
import Route from 'expresskit/route';
import {Response} from 'expresskit/route/responseHandler';

export default class UserRouter {
  @Route('GET', '/user/:id')
  public static getUser() {
    // Client recieves: 200 | {}
    return {};
  }

  @Route('PUT', '/user')
  public static updateUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Client recieves: 204
      resolve();
    });
  }

  @Route('POST', '/user')
  public static addUser(): Promise<Response> {
    return new Promise((resolve, reject) => {
      // Client recieves: 201 | User Created
      resolve(new Response(201, 'User Created'));
    });
  }

  @Route('DELETE', '/user')
  public static deleteUser() {
    // Client Recieves: 500 | You can't delete ...
    Promise.reject(`You can't delete users. I don't know why this route even exists.`);
  }
}
```

## Param, Query, Header

For a rest server to be useful, you need to pull information from the request.
Before this was done with express's `request` object. With expresskit you no longer use
`request` and `response` from express. Instead we use `@Param()`, `@Query()`, and `@Header()`.

`Param` is used to retrieve parameters from the uri. In the sample `/user/:id`, `:id` is a param.

`Query` is used to retrieve query parameters from the uri. In the sample `/users?q=foo`,
`q` is a query.

`Header` is used to retrieve request headers. And example of this would be to get the 
Authorization header. Headers are `case-insenstive`, 'authorization' and 'Authorization' are treated
the same.

```typescript
import Route from 'expresskit/route';
import {Response} from 'expresskit/route/responseHandler';

export default class UserRouter {
  @Route('GET', '/user/:id')
  public static getUser(@Param('id') userId: number) {
    return {};
  }

  @Route('GET', '/users')
  public static searchUsers(@Query('q') search: number, @Query('limit=20') limit: number, @Query('age?') age: number) {
    return {};
  }

  @Route('PUT', '/user')
  public static updateUser(@Header('Authorization') authorizationHeader: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
```

Params, Queries, and Headers are required by default. If a request is made and is missing a required property, the user will recieve a `400 Bad Request` error with a message similar to this-

> Required query missing: q

> Required header missing: Authorization

They can be made optional by adding `?` to the end of the name. When a property is optional, the request won't fail if there is no value given. Instead, the route method will recieve `undefined` in it's place. Additionally, properties can be given default values using the `=val` syntax. If no value is sent for that property, it will default to this value. You **should not** use `?` and `=` together.

## Body

In `PUT` and `POST` calls there will probably be a body to the call. To retrieve the body from the request you can use the `@Body` decorator similar to the property decorators. If the client sends a payload with content type `application/json`, the request body will be json parsed. `x-www-form-encoded` and `text` are also supported.

```typescript
import Route from 'expresskit/route';
import {Response} from 'expresskit/route/responseHandler';

export default class UserRouter {
  @Route('PUT', '/user')
  public static updateUser(@Body() update: User) {
    
  }

  @Route('POST', '/user')
  public static addUser(@Body() add: User) {

  }
}
```

## Auth

A fair amount of routes require some sort of authentication. There needs to be a
context behind the request. For example, if the `GET => /userMessages` route is called,
we need to know which user is requesting their messages. This not only helps
us give context to the request but provides a basic level of security.

```typescript
import Route from 'expresskit/route';
import {Response} from 'expresskit/route/responseHandler';

export default class UserRouter {
  @Route('GET', '/user')
  public static getUserMessages(@Auth() user: User) {
    
  }
}
```

How is authentication described? This is up to the developer to implement using
the `@Authentication()` decorator. Internally these are named as `Authentication Resources`. An Authentication Resource needs a name, in this case we'l name it 'User'. As most applications only have one Authentication Resource, we can set this as the default Authentication Resource by setting the optional second parameter of the decorator to `true`.

Authentication Resource resolvers can be injected with route properties like route methods. So in our userAuthentication method we can easily obtain the Authorization header.

```typescript
import Authentication from 'expresskit/authentication';
import {Header} from 'expresskit/property';

export default class User {
  public id: number;

  public username: string;

  public password: string;

  @Authentication('User', true)
  public static userAuthentication(@Header('Authorization') authorizationHeader: string): User {
    // use the authorization header to locate the correct user
    return new User();
  }
}
```

Because this is the default Authentication Resource we can call it without naming it - `@Auth()`. If we had multiple Authentication Resources, or wanted to be verbose, we can call other resources by passing the name in Auth- `@Auth('User')`.

You can "Fail" authentication by returning nothing, returning a rejected promise, or by
returning a `Response` with an error status. If authentication fails, and no `Response`
is given, the request will fail with a `401 Unauthenticated` error code.