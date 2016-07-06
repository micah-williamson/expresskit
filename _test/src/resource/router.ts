import {Route, Router, Response} from '../../../index';
import {Param, Header, Body} from '../../../index';
import {Resolver, Resource} from '../../../index';

export class ResourceService {
    @Resolver('Foo')
    public static fooAuth() {
        return 'fooauth';
    }

    @Resolver('Bar')
    public static barAuth(@Header('Authorization') auth: string): any {
        if(auth === 'barauth-throwerror') {
            throw new Error();
        } else if (auth === 'barauth-throwerrormessage') {
            throw new Error('bar');
        } else if (auth === 'barauth-reject') {
            return Promise.reject('foo');
        } else if (auth === 'barauth-rejectspecial') {
            return Promise.reject(new Response(405, 'foo'));
        }
        
        return auth;
    }

    @Resolver('ResponseObject')
    public static responseObject(): Response {
        return Response.Ok('foo');
    }
}

@Router('/resource')
export class ResourceRouter {
    @Route('GET', '/foo')
    public static getWidgetA(@Resource('Foo') auth: string) {
        return auth;
    }
    
    @Route('GET', '/bar')
    public static getWidgetB(@Resource('Bar') auth: string) {
        return auth;
    }

    @Route('GET', '/responseObject')
    public static responseObject(@Resource('ResponseObject') res: string) {
        return res;
    }
}