Rules
-----

[Validate and Authorize](#validateandauthorize)

[Rule and RuleHandler](#use)

[Combining Rules](#combine)

<a name="validateandauthorize"></a>
## Validate and Authorize

Rules can be used to validate and authorize requests. Most requests require some
checks to make sure the operation is safe and can be performed by the requester.
For example, you wouldn't want a user updating another user's information, and
you wouldn't want a request attempting to update a resource that doesn't exist, hit
the database. So rules can be used as a gatekeeper for requests. They should not be
used to manipulate the request (see [Middleware](/middleware/README.md)) and do not resolve
any values themselves.

A Rule must return a promise. If the promise is resolved with anything other than
an error `Expresskit Response` then the rule has been satisfied. If the promise
is rejected or an Expresskit Response with an error status code is resolve, the 
rule has failed.

<a name="use"></a>
## Rule and RuleHandler

To create a Rule we use the `RuleHandler` decorator to define our handler method.
The RuleHandler method is an injectable function, so we can inject properties
from the route context. A RuleHandler must be given a name, this name should
describe the rule being performed.

```typescript
import {Auth} from 'expresskit/auth';
import {Body} from 'expresskit/property';
import {RuleHandler} from 'expresskit/rule';
import {Response} from 'expresskit/route';

export class UserService {
  @RuleHandler('IsUserOwner')
  public static isUserOwner(@Auth('User') auth: any, @Body() user: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if(auth.userId === user.id) {
        resolve();
      } else {
        reject();

        // OR

        resolve(new Response(403, `This isn't you.`));

        // OR

        reject(`This isn't you.`);
      }
    });
  }
}
```

As mentioned before, any resolved promise is a **PASS** and any rejected promise
is a **FAIL**. The exception is if an `Expresskit Response` is resolved with
an error status code. By default, all failed rules response with a `500` error.
If an Expresskit Response is used, the status code given will be used.

With the **IsUserOwner** rule defined we can now apply it to any route method.

```typescript
// Make sure the compiler knows to include this at some point. If the UserService
// is never used directly, we will need to import the file like shown-
import './user.service';

export class UserRouter {
  @Route('PUT', '/user')
  @Rule('IsUserOwner')
  public static updateUser(@Body() user: any) {
      // update user
  }
}
```

With Rules we can cut down on the code needed to validate requests, and focus on the
logic of fulfilling the requet.

<a name="combine"></a>
## Combining Rules

A route may have multiple rules. Instead of creating a Rule for each route, you
can create specialized rules that can be mixed and matched with others. Lets say
we are selling *Widgets* and on a purchase of a Widget we need to make sure that
Widget is in stock and the User has enough money in their account. We can create
a `CanPurchaseWidget` Rule, or we can create two rules- `IsWidgetStocked` and 
`UserHasFunds`. To illustrate this, we will have two methods, `purchaseWidget` and
`addWidgetToCart`.

```typescript
export class WidgetService {
  @RuleHandler('IsWidgetStocked')
  public static isWidgetStocked(@Param('widgetId') widgetId: number): Promise<void> {
    let widget = (lookup widget from database);
    if(widget.stock > 0) {
      resolve();
    } else {
      reject('Widget is out of stock.');
    }
  }

  @RuleHandler('UserHasFunds')
  public static userHasFunds(@Param('widgetId') widgetId: number, @Auth('User') auth: any): Promise<void> {
    let widget = (lookup widget from database);
    let user = (lookup user from database);

    if(user.funds >= widget.price) {
      resolve();
    } else {
      reject('There is not enough money in your account to purchase this widget.');
    }
  }
}

export class WidgetRouter {
  @Route('POST', '/widget/:widgetId/purchase')
  @Rule('IsWidgetStocked')
  @Rule('UserHasFunds')
  public static purchaseWidget(@Param('widgetId') widgetId: number, @Auth('User') auth: any): Promise<void> {
    // all good- purchase widget
  }

  @Route('POST', '/user/cart/:widgetId')
  @Rule('IsWidgetStocked')
  public static addWidgetToCart(@Param('widgetId') widgetId: number, @Auth('User') auth: any) {
    // all good- add to cart
  }
}
```

Multiple rules behave like an `AND` operation. All rules must pass to continue the
route. If you need an `OR` operation you can add multiple rules to the same `Rule`
decorator.

```typescript
  // Only one rule needed to pass to continue the route 
  @Route('GET', '/foo')
  @Rule('RuleOne', 'RuleTwo', 'RuleThree')
  public static fooRoute() {}

  // All rules must pass to continue the route
  @Route('GET', '/foo2')
  @Rule('RuleOne')
  @Rule('RuleTwo')
  @Rule('RuleThree')
  public static fooRoute2() {}

  // RuleOne OR RuleTwo must pass in addition to RuleThree 
  @Route('GET', '/foo2')
  @Rule('RuleOne', 'RuleTwo')
  @Rule('RuleThree')
  public static fooRoute2() {}
```

It is recommended that rules are focused on single conditions when possible to allow
better flexibility, readbility, and testibility.

**NOTE:** If performance is a concern with the redundant resolutions and database calls,
this will be fixed with `Resolutions` in a future update. 


## Keep Reading

[Routing](/route/README.md)

[Middleware](/middleware/README.md)

[Auth](/auth/README.md)

[Rules](/rule/README.md)

[DTOs](/dto/README.md)

## More Links

[Expresskit Seed Project](https://github.com/iamchairs/expresskit-seed)

[Github](https://github.com/iamchairs/expresskit)

[Issues](https://github.com/iamchairs/expresskit/issues)

[NPM](https://www.npmjs.com/package/expresskit)

[Twitter](https://twitter.com/micahwllmsn)