export class Decorator {
  /**
   * Decorators are always bound to an object in some way
   */
  constructor (public object: any, public config: IDecoratorConfig) {}
}

export interface IDecoratorConfig {
  /**
   * Configurations need a name to locate the decorator definition
   */
  name: string;
  
  /**
   * Beyond the above properties, decorator configurations are open ended
   * and it's implementation is up to the developer of the decorator
   */
  [key: string]: any;
}

export class MethodDecorator extends Decorator {
  /**
   * Method decorators are bound to and object and method
   */
  constructor(object: any, public method: string, config: IDecoratorConfig) {
    super(object, config);
  }
}

export class MethodParamDecorator extends MethodDecorator {
  /**
   * Method Param decorators are bound to an object, method, and method param
   * The param being bound to is tracked by it's index
   */
  constructor(object: any, method: any, public index: number, config: IDecoratorConfig) {
    super(object, method, config);
  }
}

export class PropertyDecorator extends Decorator {
  /**
   * Method Property decorators are bound to an object and property
   */
  constructor(object: any, public property: string, config: IDecoratorConfig) {
    super(object, config);
  }
}