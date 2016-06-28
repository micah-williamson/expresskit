import {Response} from '../route/response';
import {IRoute} from '../route/manager';
import {IRuleResolver, IRuleResolverTree} from './';

export class RuleService {

  public static runRules(route: IRoute, ruleTree: IRuleResolverTree): Promise<any> {
    let promises: Promise<Promise<any>>[] = [];

    ruleTree.forEach((ruleBranch: IRuleResolver[]) => {
      promises.push(this.runRuleBranch(ruleBranch));
    });

    // Rule tree is an AND operation. All must pass to succeed
    return Promise.all(promises);
  }

  private static runRuleBranch(ruleBranch: IRuleResolver[]): Promise<any> {
    return new Promise((resolve, reject) => {
      let promises: Promise<any>[] = [];
      let running = 0;

      ruleBranch.forEach((resolver) => {

        let promise = new Promise((branchResolve, branchReject) => {
          // Rule branches are OR operations. One pass succeeds
          resolver().then((response: any) => {
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