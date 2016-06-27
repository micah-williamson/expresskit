import Route from '../../../route';
import {Param, Header, Body} from '../../../property';
import Auth from '../../../auth';
import AuthHandler from '../../../auth/handler';
import Response from '../../../route/response';

export class AuthService {
    @AuthHandler('Foo', true)
    public static fooAuth() {
        return 'fooauth';
    }

    @AuthHandler('Bar')
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
}

export class AuthRouter {
    @Route('GET', '/auth/foo')
    public static getWidgetA(@Auth() auth: string) {
        return auth;
    }
    
    @Route('GET', '/auth/bar')
    public static getWidgetB(@Auth('Bar') auth: string) {
        return auth;
    }
}