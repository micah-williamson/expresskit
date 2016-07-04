import {Response} from 'restkit/route';

export interface IOptionalParts {
  name: string;
  optional: boolean;
  default: boolean;
}

export class OptionalResolver {
  
  public getOptionalParts(name: string): IOptionalParts {
    let optional = false;
    let defaultValue: any;

    if(name[name.length-1] === '?') {
      optional = true;
      name = name.substr(0, name.length-1);
    } else {
      let defaultParts = name.split('=');
      if(defaultParts.length === 2) {
        name = defaultParts[0];
        defaultValue = defaultParts[1];
      }
    }

    return {
      name: name,
      optional: optional,
      default: defaultValue
    };
  }

  public optionallyResolve(optionalParts: IOptionalParts, val: any, type: string): Promise<any> {
    if(val) {
      return Promise.resolve(val);
    } else {
      if(optionalParts.optional) {
        return Promise.resolve();
      } else if(optionalParts.default !== undefined) {
        return Promise.resolve(optionalParts.default);
      } else {
        return Promise.reject(new Response(400, `Required ${type} missing: ${optionalParts.name}`));
      }
    }
  }

}