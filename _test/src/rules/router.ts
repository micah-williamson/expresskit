import {Route, Response} from '../../../route';
import {Rule} from '../../../rule';
import {Param, Header, Query, Body} from '../../../property';
import {Auth} from '../../../auth';

export class RuleService {
  public static failRule(): Promise<any> {
    return Promise.reject('bar');
  }

  public static failRuleCustomResponse(): Promise<Response> {
    return Promise.resolve(new Response(400, 'Test'));
  }

  public static failRuleCustomResponseRejected(): Promise<any> {
    return Promise.reject(new Response(400, 'Test'));
  }

  public static passRule(): Promise<any> {
    return Promise.resolve();
  }

  public static complexRule(@Auth() auth: string, @Param('a') a: string, @Query('b') b: string, @Header('c') c: string, @Body() d: string): Promise<any> {
    return Promise.reject(auth + '' + a + '' + b + '' + c + '' + d);
  }
  
}

export class RuleRouter {

  @Route('GET', '/rules/fail')
  @Rule(RuleService.failRule)
  public static failRule() {
    return 'foo';
  }

  @Route('GET', '/rules/failcustomresponse')
  @Rule(RuleService.failRuleCustomResponse)
  public static failRuleCustomResponse() {
    return 'foo';
  }

  @Route('GET', '/rules/failcustomresponserejected')
  @Rule(RuleService.failRuleCustomResponseRejected)
  public static failRuleCustomResponseRejected() {
    return 'foo';
  }

  @Route('GET', '/rules/pass')
  @Rule(RuleService.passRule)
  public static passRule() {
    return 'foo';
  }

  @Route('GET', '/rules/or/pass')
  @Rule(RuleService.failRule, RuleService.passRule)
  public static passOr() {
    return 'foo';
  }

  @Route('GET', '/rules/or/fail')
  @Rule(RuleService.failRule, RuleService.failRule)
  public static failOr() {
    return 'foo';
  }

  @Route('GET', '/rules/and/pass')
  @Rule(RuleService.passRule)
  @Rule(RuleService.passRule)
  public static passAnd() {
    return 'foo';
  }

  @Route('GET', '/rules/and/fail')
  @Rule(RuleService.passRule)
  @Rule(RuleService.failRule)
  public static failAnd() {
    return 'foo';
  }

  @Route('POST', '/rules/complex/:a')
  @Rule(RuleService.complexRule)
  public static complexRule() {
    return 'foo';
  }

}