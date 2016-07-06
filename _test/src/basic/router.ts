import {Route, Response} from '../../../index';
import {ResponseCode, ErrorCode} from '../../../index';
import {Context} from '../../../index';
import {Param, Query, Body} from '../../../index';
import {GET, PUT, PATCH, POST, DELETE} from '../../../index';

export class UserRouter {
    @Route('GET', '/basic')
    public static basicGet() {
        return 'get';
    }

    @Route('GET', '/basic/param/:param')
    public static getWithParam(@Param('param') param: string) {
        return param;
    }

    @Route('GET', '/basic/query')
    public static getWithQuery(@Query('q') q: string) {
        return q;
    }

    @Route('GET', '/basic/optionalquery')
    public static getWithOptionalQuery(@Query('q?') q: string) {
        if(q) {
            return q;
        }

        return 'optional';
    }

    @Route('GET', '/basic/context')
    public static getContext(@Context() req: any) {
        return req.query.foo;
    }

    @Route('GET', '/basic/errorthrown')
    public static errorThrown() {
        throw new Error();
    }

    @Route('GET', '/basic/errorthrownwithmessage')
    public static errorThrownWithMessage() {
        throw new Error('foo');
    }

    @Route('GET', '/basic/errorthrownwithresponse')
    public static errorThrownWithResponse() {
        throw Response.BadRequest();
    }

    @Route('GET', '/basic/rejectedpromise')
    public static rejectedPromise() {
        return Promise.reject('foo');
    }

    @Route('GET', '/basic/rejectedpromisewithresponse')
    public static rejectedPromiseWithResponse() {
        return Promise.reject(Response.MethodNotAllowed('foo'));
    }

    @Route('GET', '/basic/resolvedpromise')
    public static resolvedPromise() {
        return Promise.resolve();
    }

    @Route('GET', '/basic/resolvedpromisewithmessage')
    public static resolvedPromiseWithMessage() {
        return Promise.resolve('foo');
    }

    @Route('GET', '/basic/resolvedpromisewithresponse')
    public static resolvedPromiseWithResponse() {
        return Promise.resolve(new Response(201, 'foo'));
    }

    @Route('GET', '/basic/response')
    public static basicResponse() {
        return new Response(201, 'foo');
    }

    @Route('GET', '/basic/defaultquery')
    public static getWithDefaultQuery(@Query('q=def') q: string) {
        return q;
    }

    @Route('GET', '/basic/defaulterrorcode')
    @ErrorCode(505)
    public static getWithDefaultErrorCode(): Promise<any> {
        return Promise.reject('foo');
    }

    @Route('GET', '/basic/defaultresponsecode')
    @ResponseCode(201)
    public static getWithDefaultResponseCode() {
        return 'foo';
    }
    
    @Route('PUT', '/basic')
    public static basicPut() {
        return 'put';
    }

    @Route('PUT', '/basic/noresponse')
    public static putNoResponse() {}

    @Route('PUT', '/basic/payload')
    @Route('PATCH', '/basic/payload')
    @Route('POST', '/basic/payload')
    public static putPayload(@Body() payload: any) {
        return payload;
    }

    @Route('PATCH', '/basic')
    public static basicPatch() {
        return 'patch';
    }
    
    @Route('POST', '/basic')
    public static basicPost() {
        return 'post';
    }

    @Route('DELETE', '/basic')
    public static basicDelete() {
        return 'delete';
    }

    @GET('/alias')
    public static getAlias() {
        return 'getalias';
    }

    @PUT('/alias')
    public static putAlias() {
        return 'putalias';
    }

    @POST('/alias')
    public static postAlias() {
        return 'postalias';
    }

    @PATCH('/alias')
    public static patchAlias() {
        return 'patchalias';
    }

    @DELETE('/alias')
    public static deleteAlias() {
        return 'deletealias';
    }
}