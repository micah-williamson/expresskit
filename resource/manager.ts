import Resource from './index';

export interface IResourceMap {
  [key: string]: any;
}

export default class ResourceManager {
  private static resources: IResourceMap;

  public static registerResource(name: string, resource: any) {
    if(!ResourceManager.resources[name]) {
      ResourceManager.resources[name] = resource;
    }
  }

  public static getResource(name: string) {
    return ResourceManager.resources[name];
  }

}