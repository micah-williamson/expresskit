let request = require('request');
let assert = require('chai').assert;

describe('Auth', () => {

    it('should resolve foo authentication', (done) => {

        request('http://localhost:8000/auth/foo', (err, response, body) => {
            assert.equal(err, null);
            assert.equal(body, 'fooauth');
            assert.equal(response.statusCode, 200);

            done();
        });

    });

    it('should resolve bar authentication using the Authorization header as the auth', (done) => {
        request('http://localhost:8000/auth/bar', {
            headers: {
                Authorization: 'barauth'
            }
        }, (err, response, body) => {
            assert.equal(err, null);
            assert.equal(body, 'barauth');
            assert.equal(response.statusCode, 200);

            done();
        });
    });

    it('should fail authentication with a thrown error', (done) => {
        request('http://localhost:8000/auth/bar', {
            headers: {
                Authorization: 'barauth-throwerror'
            }
        }, (err, response, body) => {
            assert.equal(err, null);
            assert.equal(response.statusCode, 500);

            done();
        });
    });

    it('should fail authentication if the handler is rejected', (done) => {
        request('http://localhost:8000/auth/bar', {
            headers: {
                Authorization: 'barauth-reject'
            }
        }, (err, response, body) => {
            assert.equal(err, null);
            assert.equal(body, 'foo');
            assert.equal(response.statusCode, 401);

            done();
        });
    });

    it('should fail authentication if the handler is rejected with a different status code', (done) => {
        request('http://localhost:8000/auth/bar', {
            headers: {
                Authorization: 'barauth-rejectspecial'
            }
        }, (err, response, body) => {
            assert.equal(err, null);
            assert.equal(body, 'foo');
            assert.equal(response.statusCode, 405);

            done();
        });
    });

});