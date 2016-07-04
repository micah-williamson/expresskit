import {Route, Response} from 'restkit/route';
import {Rule, RuleHandler} from 'restkit/rule';
import {Auth} from 'restkit/auth';

import {Param, Header, Query, Body} from '../../../injectables';

export class RuleService {
  @RuleHandler('FailRule')
  public static failRule(): Promise<any> {
    return Promise.reject('bar');
  }

  @RuleHandler('FailRuleCustomResponse')
  public static failRuleCustomResponse(): Promise<Response> {
    return Promise.resolve(new Response(400, 'Test'));
  }

  @RuleHandler('FailRuleCustomResponseRejected')
  public static failRuleCustomResponseRejected(): Promise<any> {
    return Promise.reject(new Response(400, 'Test'));
  }

  @RuleHandler('PassRule')
  public static passRule(): Promise<any> {
    return Promise.resolve();
  }

  @RuleHandler('ComplexRule')
  public static complexRule(@Auth() auth: string, @Param('a') a: string, @Query('b') b: string, @Header('c') c: string, @Body() d: any): Promise<any> {
    return Promise.reject(auth + '' + a + '' + b + '' + c + '' + d.d);
  }
  
}

export class RuleRouter {

  @Route('GET', '/rules/fail')
  @Rule('FailRule')
  public static failRule() {
    return 'foo';
  }

  @Route('GET', '/rules/failcustomresponse')
  @Rule('FailRuleCustomResponse')
  public static failRuleCustomResponse() {
    return 'foo';
  }

  @Route('GET', '/rules/failcustomresponserejected')
  @Rule('FailRuleCustomResponseRejected')
  public static failRuleCustomResponseRejected() {
    return 'foo';
  }

  @Route('GET', '/rules/pass')
  @Rule('PassRule')
  public static passRule() {
    return 'foo';
  }

  @Route('GET', '/rules/or/pass')
  @Rule('FailRule', 'PassRule')
  public static passOr() {
    return 'foo';
  }

  @Route('GET', '/rules/or/fail')
  @Rule('FailRule', 'FailRule')
  public static failOr() {
    return 'foo';
  }

  @Route('GET', '/rules/and/pass')
  @Rule('PassRule')
  @Rule('PassRule')
  public static passAnd() {
    return 'foo';
  }

  @Route('GET', '/rules/and/fail')
  @Rule('PassRule')
  @Rule('FailRule')
  public static failAnd() {
    return 'foo';
  }

  @Route('POST', '/rules/complex/:a')
  @Rule('ComplexRule')
  public static complexRule() {
    return 'foo';
  }

}