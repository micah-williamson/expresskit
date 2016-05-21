import ResourceManager from './manager';

export default function Resource(name: string) {
  return function(resource: any) {
    ResourceManager.registerResource(name, resource);
  }
}