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
            id: 1
        }

        request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
            assert.equal(err, null);
            assert.deepEqual(body, user);
            assert.equal(response.statusCode, 200);

            done();
        });

    });

    describe('Validation', () => {

        describe('Require', () => {

            it('should fail if the payload is missing required properties', (done) => {
                let user = {
                    email: 'bar'
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'Required property missing: id');
                    assert.equal(response.statusCode, 400);

                    done();
                });

            });
            
        });

        describe('Type', () => {

            it('should fail if the a string is not given', (done) => {
                let user = {
                    id: 1,
                    typeTestString: 1
                };

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'typeTestString was expected to be string');
                    assert.equal(response.statusCode, 400);

                    done();
                });

            });

            it('should pass if a string is given', (done) => {
                let user = {
                    id: 1,
                    typeTestString: 'foo'
                };

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.deepEqual(body, user);
                    assert.equal(response.statusCode, 200);

                    done();
                });

            });

            it('should fail if the a number is not given', (done) => {
                let user = {
                    id: 1,
                    typeTestNumber: 'foo'
                };

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'typeTestNumber was expected to be number');
                    assert.equal(response.statusCode, 400);

                    done();
                });

            });

            it('should pass if a number is given', (done) => {
                let user = {
                    id: 1,
                    typeTestNumber: 1
                };

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.deepEqual(body, user);
                    assert.equal(response.statusCode, 200);

                    done();
                });

            });

            it('should fail if the an object is not given', (done) => {
                let user = {
                    id: 1,
                    typeTestObject: 'foo'
                };

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'typeTestObject was expected to be object');
                    assert.equal(response.statusCode, 400);

                    done();
                });

            });

            it('should pass if an object is given', (done) => {
                let user = {
                    id: 1,
                    typeTestObject: {}
                };

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.deepEqual(body, user);
                    assert.equal(response.statusCode, 200);

                    done();
                });

            });

            it('should fail if the an array is not given', (done) => {
                let user = {
                    id: 1,
                    typeTestArray: 'foo'
                };

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'typeTestArray was expected to be array');
                    assert.equal(response.statusCode, 400);

                    done();
                });

            });

            it('should pass if an object is given', (done) => {
                let user = {
                    id: 1,
                    typeTestArray: []
                };

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.deepEqual(body, user);
                    assert.equal(response.statusCode, 200);

                    done();
                });

            });
            
        });

        describe('Length', () => {

            it('should fail if the string given is too short', (done) => {
                let user = {
                    id: 1,
                    lengthTest: 'fo'
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'lengthTest expected to have a minimum length of 3');
                    assert.equal(response.statusCode, 400);

                    done();
                });

            });

            it('should fail if the string given is too long', (done) => {
                let user = {
                    id: 1,
                    lengthTest: 'foooooo'
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'lengthTest exceeds the maximum length of 5');
                    assert.equal(response.statusCode, 400);

                    done();
                });

            });

            it('should pass if the string given is within the expected range', (done) => {
                let user = {
                    id: 1,
                    lengthTest: 'foo'
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.deepEqual(body, user);
                    assert.equal(response.statusCode, 200);

                    done();
                });

            });
            
        });

        describe('Min/Max', () => {

            it('should fail if the number is too low', (done) => {
                let user = {
                    id: 1,
                    valueTest: 2
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'valueTest must be at least 3');
                    assert.equal(response.statusCode, 400);

                    done();
                });

            });

            it('should fail if the value given is too large', (done) => {
                let user = {
                    id: 1,
                    valueTest: 8
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'valueTest cannot exceed 5');
                    assert.equal(response.statusCode, 400);

                    done();
                });

            });

            it('should pass if the value given is within the expected range', (done) => {
                let user = {
                    id: 1,
                    valueTest: 4
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.deepEqual(body, user);
                    assert.equal(response.statusCode, 200);

                    done();
                });

            });
            
        });

        describe('Pattern', () => {

            it('should fail if the pattern is not met (all inclusive)', (done) => {
                let user = {
                    id: 1,
                    patternTest1: 'abcdefghijklmnopqrstuvwxyz!ABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321'
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'patternTest1 does not satisfy pattern /^[\\w\\d]+$/');
                    assert.equal(response.statusCode, 400);

                    done();
                });

            });

            it('should pass if the pattern is met (all inclusive)', (done) => {
                let user = {
                    id: 1,
                    patternTest1: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321'
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.deepEqual(body, user);
                    assert.equal(response.statusCode, 200);

                    done();
                });

            });

            it('should fail if the pattern is not met', (done) => {
                let user = {
                    id: 1,
                    patternTest2: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321'
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'patternTest2 does not satisfy pattern /[^\\w\\d\\s]/');
                    assert.equal(response.statusCode, 400);

                    done();
                });

            });

            it('should pass if the pattern is met', (done) => {
                let user = {
                    id: 1,
                    patternTest2: 'abcdefghijklmnopqrstuvwxyz!ABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321'
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.deepEqual(body, user);
                    assert.equal(response.statusCode, 200);

                    done();
                });

            });
            
        });

        describe('Custom Errors', () => {

            it('should use custom errors if given', (done) => {

                let user = {
                    id: 1,
                    customErrorTest: 'foo'
                }

                request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                    assert.equal(err, null);
                    assert.equal(body, 'this is a custom error');
                    assert.equal(response.statusCode, 400);

                    done();
                });
                
            });
            
        });

    });

    describe('ScrubIn', () => {

        it('should scrub propreties coming in', (done) => {
            let user = {
                email: 'bar',
                id: 1,
                username: 'foo'
            }

            request.put('http://localhost:8000/user', {headers: {'Authorization': 'foo'}, json: user}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);

                // scrubbed
                delete user.username;

                assert.deepEqual(body, user);

                done();
            });

        });
        
    });

    describe('ScrubOut', () => {

        it('should scrub properties going out', (done) => {
            let user = {
                email: 'bar',
                id: 1,
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