let request = require('request');
let assert = require('chai').assert;

/**
 * 
export class User {
    @ScrubIn()
    id: string;
    
    username: string;
    
    @ScrubOut()
    password: string;
    
    email: string;
}
 */

describe('DTO', () => {

    it('should return the user', (done) => {

        let user = {
            email: 'bar',
            id: 1,
            username: 'foo'
        }

        request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
            assert.equal(err, null);
            assert.equal(response.statusCode, 200);
            assert.deepEqual(body, user);

            done();
        });

    });

    describe('Require', () => {

        it('should fail if the payload is missing required properties', (done) => {
            let user = {
                email: 'bar',
                username: 'foo'
            }

            request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 400);
                assert.equal(body, 'Required property missing: id');

                done();
            });

        });
        
    });

    describe('ScrubOut', () => {

        it('should scrub properties going out', (done) => {
            let user = {
                email: 'bar',
                id: 1,
                username: 'foo',
                password: 'baz'
            }

            request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);

                // scrubbed
                delete user.password;

                assert.deepEqual(body, user);

                done();
            });

        });

    });

});