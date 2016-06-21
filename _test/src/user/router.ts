import Route from '../../../route';
import {Param, Header, Body} from '../../../property';
import Auth from '../../../auth';
import AuthHandler from '../../../auth/handler';
import {ScrubIn, ScrubOut, Required} from '../../../dto';

export class User {
    @ScrubIn()
    id: string;
    
    username: string;
    
    @ScrubOut()
    @ScrubIn('!CreateUser')
    password: string;
    
    @ScrubIn('!CreateUser')
    email: string;
}

export class UserService {
    @AuthHandler('User', true)
    public static resolveAuth(@Header('Authorization') auth: string) {
        let user = new User();
        
        user.id = auth;
        user.username = 'foo';
        user.password = 'password';
        user.email = 'email@gmail.com';
    }
}

export class UserRouter {
    @Route('GET', '/user/:userId')
    @Describe('GetUser')
    public static getUser(@Param('userId') userId: number) {}
    
    @Route('PUT', '/user')
    @Describe('UpdateUser')
    public static updateUser(@Auth() user: User, @Body(User) update: User) {}
    
    @Route('POST', '/user')
    @Describe('CreateUser')
    public static createUser(@Body(User) user: User) {
        
    }
}