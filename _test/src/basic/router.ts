import {Route, Response} from 'restkit/route';
import {Context} from 'restkit/injectables';
import {Param, Query, Body} from '../../../injectables';

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

    @Route('GET', '/basic/rejectedpromise')
    public static rejectedPromise() {
        return Promise.reject('foo');
    }

    @Route('GET', '/basic/rejectedpromisewithresponse')
    public static rejectedPromiseWithResponse() {
        return Promise.reject(new Response(405, 'foo'));
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
    
    @Route('PUT', '/basic')
    public static basicPut() {
        return 'put';
    }

    @Route('PUT', '/basic/noresponse')
    public static putNoResponse() {}

    @Route('PUT', '/basic/payload')
    @Route('POST', '/basic/payload')
    public static putPayload(@Body() payload: any) {
        return payload;
    }
    
    @Route('POST', '/basic')
    public static basicPost() {
        return 'post';
    }

    @Route('DELETE', '/basic')
    public static basicDelete() {
        return 'delete';
    }
}