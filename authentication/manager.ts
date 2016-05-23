export interface AutheticationResourceResolver {
  (... args: any[]): IAuthenticationResource;
}

export class IAuthenticationResource {
  public name: string;

  public isDefault: boolean = false;

  public object: any;

  public method: string;
}

export default class AuthenticationManager {
  public static resources: IAuthenticationResource[] = [];

  /**
   * @description Registers the given authentication resource
   * @param {AuthenticationResource} resource [description]
   */
  public static registerAuthenticationResource(resource: IAuthenticationResource) {
    let defaultResource = this.getDefault();
    let namedResource = this.getResourceByName(resource.name);

    if(resource.isDefault && defaultResource) {
      throw new Error(`Unable to register authentication at ${resource.object.prototype.constructor.name}.${resource.method} as a default authentication resolution method. ${defaultResource.object.prototype.constructor.name}.${defaultResource.method} is already the default authentication method.`);
    }

    if(namedResource) {
      throw new Error(`Unable to register authentication at ${resource.object.prototype.constructor.name}.${resource.method} with the name '${resource.name}'. ${namedResource.object.prototype.constructor.name}.${namedResource.method} has already registered this name.`);
    }

    this.resources.push(resource);
  }

  /**
   * @Description Returns the authentication resource by name
   * @param  {string}                 nm [description]
   * @return {AuthenticationResource}    [description]
   */
  public static getResourceByName(nm: string): IAuthenticationResource {
    let resource: IAuthenticationResource = null;

    this.resources.forEach((res) => {
      if(res.name === nm) {
        resource = res;
      }
    });

    return resource;
  }

  /**
   * @Description Returns the default authentication resource
   * @return {AuthenticationResource} [description]
   */
  public static getDefault(): IAuthenticationResource {
    let resource: IAuthenticationResource = null;

    this.resources.forEach((res) => {
      if(res.isDefault) {
        resource = res;
      }
    });

    return resource;
  }

  /**
   * @description Returns TRUE if a default authentication resource is registered
   * @return {boolean} [description]
   */
  public static hasDefault(): boolean {
    let defaultFound = false;

    this.resources.forEach((resource) => {
      if(resource.isDefault) {
        defaultFound = true;
      }
    });

    return defaultFound;
  }
}