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