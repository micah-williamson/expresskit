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