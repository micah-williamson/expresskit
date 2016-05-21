export interface AutheticationResourceResolver {
  (... args: any[]): IAuthenticationResource;
}

export class IAuthenticationResource {
  public name: string;

  public isDefault: boolean = false;

  public resolve: AutheticationResourceResolver;
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
      let constructorName = (<any>resource).prototype.constructor.name;
      let defaultConstructorName = (<any>defaultResource).prototype.constructor.name;

      throw new Error(`Unable to register authentication resource '${constructorName}' as a default authentication resource. '${defaultConstructorName}' is already the default authentication resource.`);
    }

    if(namedResource) {
      let constructorName = (<any>resource).prototype.constructor.name;
      let namedConstructorName = (<any>namedResource).prototype.constructor.name;

      throw new Error(`Unable to register authentication resource '${constructorName}' with the name '${resource.name}'. '${namedConstructorName}' has already registered this name.`);
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