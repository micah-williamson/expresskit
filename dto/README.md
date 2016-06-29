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
    type: 'string'
  })
  public id: string;

  @Validate({
    required: true,
    type: 'string',
    minLength: 8,
    maxLength: 32,
    pattern: [/^[\w\d]+$/, 'Only alphanumeric values allowed']
  })
  public username: string;

  @Validate({
    required: true,
    type: 'string',
    min: 13,
    max: [120, 'I doubt it']
  })
  public age: number;

  @Validate({
    required: true,
    type: 'string'
  })
  public email: string;

  @Validate({
    required: true,
    type: 'string',
    minLength: 8,
    maxLength: 32,
    pattern: [/[\w\d\s]/, 'At least one special character is required']
  })
  @ScrubOut()
  public password: string;

  @Validate({
    type: 'string',
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