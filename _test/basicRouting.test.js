require('./bld/route/response.js');

let request = require('request');
let assert = require('chai').assert;

describe('Basic Routing', () => {

    describe('GET', () => {

        it('should GET', (done) => {
            request('http://localhost:8000/basic', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.equal(body, 'get');
                done();
            });
        });

        it('should pass params', (done) => {
            request('http://localhost:8000/basic/param/foo', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.equal(body, 'foo');
                done();
            });
        });

        it('should pass query params', (done) => {
            request('http://localhost:8000/basic/query?q=foo', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.equal(body, 'foo');
                done();
            });
        });

        it('should fail if required query params arent passed', (done) => {
            request('http://localhost:8000/basic/query', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 400);
                assert.equal(body, 'Required query parameter missing: q');
                done();
            });
        });

        it('should pass optional query params', (done) => {
            request('http://localhost:8000/basic/optionalquery?q=foo', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.equal(body, 'foo');
                done();
            });
        });

        it('should not fail if an option query param is not passed', (done) => {
            request('http://localhost:8000/basic/optionalquery', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.equal(body, 'optional');
                done();
            });
        });

        it('should pass query params with a default value', (done) => {
            request('http://localhost:8000/basic/defaultquery?q=foo', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.equal(body, 'foo');
                done();
            });
        });

        it('should handle an error thrown', (done) => {
            request('http://localhost:8000/basic/errorthrown', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 500);
                done();
            });
        });

        it('should handle an error thrown with a message', (done) => {
            request('http://localhost:8000/basic/errorthrownwithmessage', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 500);
                assert.equal(body, 'Error: foo');
                done();
            });
        });

        it('should handle a resolved promise', (done) => {
            request('http://localhost:8000/basic/resolvedpromise', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 204);
                assert.equal(body, '');
                done();
            });
        });

        it('should handle a resolved promise with a message', (done) => {
            request('http://localhost:8000/basic/resolvedpromisewithmessage', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.equal(body, 'foo');
                done();
            });
        });

        it('should handle a resolved promise with a response', (done) => {
            request('http://localhost:8000/basic/resolvedpromisewithresponse', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 201);
                assert.equal(body, 'foo');
                done();
            });
        });

        it('should handle a rejected promise', (done) => {
            request('http://localhost:8000/basic/rejectedpromise', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 500);
                assert.equal(body, 'foo');
                done();
            });
        });

        it('should handle a rejected promise with a message', (done) => {
            request('http://localhost:8000/basic/rejectedpromise', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 500);
                assert.equal(body, 'foo');
                done();
            });
        });

        it('should handle a rejected promise with a response', (done) => {
            request('http://localhost:8000/basic/rejectedpromisewithresponse', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 405);
                assert.equal(body, 'foo');
                done();
            });
        });

        it('should handle a returned response', (done) => {
            request('http://localhost:8000/basic/response', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 201);
                assert.equal(body, 'foo');
                done();
            });
        });

    });

    describe('PUT', () => {
        
        it('should PUT', (done) => {
            request.put('http://localhost:8000/basic', {}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.equal(body, 'put');
                done();
            });
        });

        it('should default to 204 response', (done) => {
            request.put('http://localhost:8000/basic/noresponse', {}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 204);
                assert.equal(body, '');
                done();
            });
        });

        it('should accept the payload', (done) => {
            let payload = {payload: 'foo'};
            request.put('http://localhost:8000/basic/payload', {json: payload}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.deepEqual(body, payload);
                done();
            });
        });

    });

    describe('POST', () => {

        it('should POST', (done) => {
            request.post('http://localhost:8000/basic', {}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.equal(body, 'post');
                done();
            });
        });

        it('should accept the payload', (done) => {
            let payload = {payload: 'foo'};
            request.post('http://localhost:8000/basic/payload', {json: payload}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.deepEqual(body, payload);
                done();
            });
        });

    });

    describe('DELETE', () => {

        it('should DELETE', (done) => {
            request.delete('http://localhost:8000/basic', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 200);
                assert.equal(body, 'delete');
                done();
            });
        });

    });
});