import {fatal} from '../error';
import {Response} from '../route/response';
import {IRoute} from '../route/manager';
import {InjectorService} from '../injector/service';

export class IRuleHandler {
  public name: string;

  public object: any;

  public method: string;
}

export interface IRuleResolver {
  (... val: any[]): Promise<any | Response>;
}

export type IRuleResolverBranch = Array<string>;

export type IRuleResolverTree = Array<IRuleResolverBranch>;

export class RuleService {
  public static handlers: IRuleHandler[] = [];  

  /**
   * Registers the given rule handler
   */
  public static registerRuleHandler(handler: IRuleHandler) {
    let namedHandler = this.getHandlerByName(handler.name);

    if(namedHandler) {
      fatal(new Error(`Unable to register rule at ${handler.object.prototype.constructor.name}.${handler.method} with the name '${handler.name}'. ${namedHandler.object.prototype.constructor.name}.${namedHandler.method} has already registered this name.`));
    }

    this.handlers.push(handler);
  }

  /**
   * Returns the rule handler by name
   */
  public static getHandlerByName(name: string): IRuleHandler {
    let handler: IRuleHandler = null;

    this.handlers.forEach((res) => {
      if(res.name === name) {
        handler = res;
      }
    });

    return handler;
  }

  /**
   * Runs a rule tree
   */
  public static runRules(ruleTree: IRuleResolverTree, context: any): Promise<any> {
    let promises: Promise<Promise<any>>[] = [];

    ruleTree.forEach((ruleBranch: IRuleResolverBranch) => {
      promises.push(this.runRuleBranch(ruleBranch, context));
    });

    // Rule tree is an AND operation. All must pass to succeed
    return Promise.all(promises);
  }

  /**
   * Runs a rule branch
   */
  private static runRuleBranch(ruleBranch: IRuleResolverBranch, context: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let promises: Promise<any>[] = [];
      let running = 0;

      ruleBranch.forEach((resolverName) => {
        let handler = this.getHandlerByName(resolverName);

        let promise = new Promise((branchResolve, branchReject) => {
          // Rule branches are OR operations. One pass succeeds
          InjectorService.run(handler.object, handler.method, context).then((response: any) => {
            if(response instanceof Response && (<Response>response).httpCode >= 400) {
              branchReject(response);
            } else {
              resolve();
              branchResolve();
            }
          }).catch((response: any) => {
            branchReject(response);
          });
        });

        promises.push(promise);
      });

      // All promises must fail to fail the branch
      Promise.all(promises).catch((response: any) => {
        reject(response);
      });
    });
  }

}