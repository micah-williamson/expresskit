import {fatal} from '../error';

export class IAuthHandler {
  public name: string;

  public isDefault: boolean = false;

  public object: any;

  public method: string;
}

export class AuthManager {
  public static handlers: IAuthHandler[] = [];

  /**
   * @description Registers the given authentication handler
   * @param {AuthenticationHandler} handler [description]
   */
  public static registerAuthenticationHandler(handler: IAuthHandler) {
    let defaultHandler = this.getDefault();
    let namedHandler = this.getHandlerByName(handler.name);

    if(handler.isDefault && defaultHandler) {
      fatal(new Error(`Unable to register authentication handler at ${handler.object.prototype.constructor.name}.${handler.method} as a default authentication resolution method. ${defaultHandler.object.prototype.constructor.name}.${defaultHandler.method} is already the default authentication method.`));
    }

    if(namedHandler) {
      fatal(new Error(`Unable to register authentication handler at ${handler.object.prototype.constructor.name}.${handler.method} with the name '${handler.name}'. ${namedHandler.object.prototype.constructor.name}.${namedHandler.method} has already registered this name.`));
    }

    this.handlers.push(handler);
  }

  /**
   * @Description Returns the authentication handler by name
   * @param  {string}                 nm [description]
   * @return {AuthenticationHandler}    [description]
   */
  public static getHandlerByName(nm: string): IAuthHandler {
    let handler: IAuthHandler = null;

    this.handlers.forEach((res) => {
      if(res.name === nm) {
        handler = res;
      }
    });

    return handler;
  }

  /**
   * @Description Returns the default authentication handler
   * @return {AuthenticationHandler} [description]
   */
  public static getDefault(): IAuthHandler {
    let handler: IAuthHandler = null;

    this.handlers.forEach((res) => {
      if(res.isDefault) {
        handler = res;
      }
    });

    return handler;
  }

  /**
   * @description Returns TRUE if a default authentication handler is registered
   * @return {boolean} [description]
   */
  public static hasDefault(): boolean {
    let defaultFound = false;

    this.handlers.forEach((handler) => {
      if(handler.isDefault) {
        defaultFound = true;
      }
    });

    return defaultFound;
  }
}