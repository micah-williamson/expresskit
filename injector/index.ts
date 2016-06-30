export class IInjectable {
  index: number;
  arguments: any[];
}

export type Injection = IInjectionConfig[];

export interface IInjectionResolver {
  resolve(injectable: IInjectable, context: any): Promise<any>;
}

export class IInjectionConfig {
  injectionResolver: IInjectionResolver;
  injectable: IInjectable;
}