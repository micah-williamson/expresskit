export interface IDictionary {
  [key: string]: any;
}

export default class RequestConfig {
  public request: any;
  public url: string;
  public params: IDictionary = {};
  public query: IDictionary = {};
  public resources: IDictionary = {};
}
