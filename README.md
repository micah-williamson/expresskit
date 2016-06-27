expresskit
==========

This is an experimental node rest server library using decorators.
Developers using Java and C# frameworks are familiar with annotations when writing restful services.
`expresskit` is an attempt to bring some of those useful annotations to node rest servers.

### Prerequisites

`Node ~6.2.2`
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
import {Param, Query, Header} from 'expresskit/property';

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

## Rules and Authorization

Don't confuse Authentication and Authorization. Use Authentication to identify the request, but just having an identity doesn't
mean you are authorized to perform the action you are attempting to perform. For that we need Authorization- or `Rules` in 
expresskit. Similar to Auth Handlers you must create a `Rule Handler`. A Rule Handler should return a resolved or rejected promise.
When a promise is resolved, the rule is satisfied, when the promise is rejected, the rule has failed.

```typescript
import Auth from 'expresskit/auth';
import RuleHandler from 'expresskit/rule/handler';
import Response from 'expresskit/route/response';

export default class UserService {
  @RuleHandler('User', 'Owner')
  public static isOwner(@Auth() user: User, @Body() update: User) {
    if(user.id === update.id) {
      return Promise.resolve();
    } else {
      return Promise.reject();
      
      // or
      
      return Promise.reject(new Response(403, `Not Authorized`)) 
    }
  }
}
```

Once a rule handler is defined, it can be added to routes.

```typescript
import Route from 'expresskit/route';
import {Body} from 'expresskit/property';
import Auth from 'expresskit/auth';
import Rule from 'expresskit/rule';
import User from './index';

export default class UserRouter {
  @Route('PUT', '/user')
  @Rule('User', 'Owner')
  public static updateUser(@Body() update: User, @Auth('User') user: User) {
    return user;
  }
}
```

Rule Handlers are not limited to authorization so they aren't called Authorization Handlers.

## Validation and Response Types

With Expresskit your can define simple DTOs and Response Types on your routes. When you define a DTO,
you can add validation rules for the DTO. If a request comes in that is expecting that DTO, the request
will fail with a `400: Bad Request` if it does not satisfy validation.

To define a DTO, just create a standard class and begin decorating it's properties.

Example:

```typescript
import {Validate, ScrubIn, ScrubOut, ResponseType) from 'expresskit/dto';

export class User {
  @Validate({
    required: true,
    type: string
  })
  public id: number;

  @Validate({
    required: true,
    type: string,
    minLength: 8,
    maxLength: 32,
    pattern: [/^[\w\d]+$/, 'Only alphanumeric values allowed']
  })
  public username: string;

  @Validate({
    required: true,
    type: string,
    min: 13,
    max: [120, 'I doubt it']
  })
  public age: number;

  @Validate({
    required: true,
    type: string
  }
  public email: string;

  @Validate({
    required: true,
    type: string,
    minLength: 8,
    maxLength: 32,
    pattern: [/[\w\d\s]/, 'At least one special character is required']
  })
  @ScrubOut()
  public password: string;

  @Validate({
    type: string,
    values: 'F,M'
  })
  public gender: string;

  @ScrubIn()
  public created: string;

  @ScrubIn()
  public updated: string;
}

export class UserRouter {
  @Route('PUT', '/user')
  @ResponseType(User)
  public updateUser(@Body(User) update: User) {
    return UserService.updateUser(update);
  }
}
```

In addition to the rule for validation, a custom reason for why validation failed can be given. To do this, a tuple is used where the
first value is the rule and the second is the reason.

### Validation Options

**required: boolean** - Fails validation if the incoming request does not contain this property.

**type: any** - Fails if the property coming in is not this type. Possible values are string, number, Object, and Array.

**minLength: number** - Fails validation if the incoming string exists and does not have the minimum length.

**maxLength: number** - Fails validation if the incoming string exists and does not have the maximum length.

**min: number** - Fails validation if the incoming number is lower than this value.

**max: number** - Fails validation if the incoming number is higher than this value.

**pattern: RegExp** - Fails validation if the incoming request does not match the pattern.

**values: string** - Values should be a csv of possible values. This should only be used for simple string or number types.

### Scrubbing

For convenience sake, you may want to scrub data going in or out. For example, you don't want the update data to contain the `created` or `updated` datetime.
In in all cases you don't want the password available on any request. Traditionally you'd have to scrub these properties manually, but using `ScrubIn` and `ScrubOut` you can
implement scrubbing with a decoration.

To use `ScrubOut` you need to set the ResponseType of the route.