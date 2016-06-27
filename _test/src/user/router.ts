import Route from '../../../route';
import {Param, Header, Body} from '../../../property';
import Auth from '../../../auth';
import AuthHandler from '../../../auth/handler';
import {ScrubOut, ScrubIn, Validate, ResponseType} from '../../../dto';

export class User {
    @Validate({
        required: true
    })
    id: string;
    
    @ScrubIn()
    username: string;
    
    @ScrubOut()
    password: string;
    
    email: string;

    @Validate({
        type: 'string'
    })
    typeTestString: string;

    @Validate({
        type: 'number'
    })
    typeTestNumber: number;

    @Validate({
        type: 'object'
    })
    typeTestObject: Object;

    @Validate({
        type: 'array'
    })
    typeTestArray: Array<any>;

    @Validate({
        minLength: 3,
        maxLength: 5
    })
    lengthTest: string;

    @Validate({
        min: 3,
        max: 5
    })
    valueTest: number;

    @Validate({
        pattern: /^[\w\d]+$/
    })
    patternTest1: string;

    @Validate({
        pattern: /[^\w\d\s]/
    })
    patternTest2: string;

    @Validate({
        values: 'M,F'
    })
    enumTest: string;
}

export class UserService {
    @AuthHandler('User')
    public static resolveAuth(@Header('Authorization') auth: string): User {
        let user = new User();
        
        user.id = auth;
        user.password = 'password';
        user.email = 'email@gmail.com';

        return user;
    }
}

export class UserRouter {
    @Route('PUT', '/user')
    @ResponseType(User)
    public static updateUser(@Auth('User') user: User, @Body(User) update: User) {
        return update;
    }
}