[<img src="https://s32.postimg.org/4yopf47n9/restkitexpress.png" height="100"/>](https://github.com/iamchairs/expresskit)

Express support for [Restkit](https://github.com/iamchairs/restkit). 

## Install

```
npm install expresskit --save
```

## Start 

```typescript
import {Expresskit} from 'expresskit';

Expresskit.start();
```

## Use

```typescript
import {Route, Param, Query, Header, Body} from 'expresskit';

export class UserRouter {
  @Route('PUT', '/user/:id')
  public updateUser(@Param('id') id: string, @Query('foo') foo: string, @Header('Authorization') auth: string, @Body() update: any) {
  }
}
```

## More Links

[Restkit](https://github.com/iamchairs/restkit)

[Github](https://github.com/iamchairs/expresskit)

[Issues](https://github.com/iamchairs/expresskit/issues)

[NPM](https://www.npmjs.com/package/expresskit)

[Twitter](https://twitter.com/micahwllmsn)