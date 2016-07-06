let request = require('request');
let assert = require('chai').assert;

describe('Basic Routing', () => {

    describe('GET', () => {

        it('should GET', (done) => {
            request('http://localhost:8000/basic', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'get');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should accept the aliased @GET', (done) => {
            request('http://localhost:8000/alias', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'getalias');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should pass params', (done) => {
            request('http://localhost:8000/basic/param/foo', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should pass query params', (done) => {
            request('http://localhost:8000/basic/query?q=foo', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should resolve the context', (done) => {
            request('http://localhost:8000/basic/context?foo=bar', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'bar');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should fail if required query params arent passed', (done) => {
            request('http://localhost:8000/basic/query', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'Required query parameter missing: q');
                assert.equal(response.statusCode, 400);
                done();
            });
        });

        it('should pass optional query params', (done) => {
            request('http://localhost:8000/basic/optionalquery?q=foo', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should not fail if an option query param is not passed', (done) => {
            request('http://localhost:8000/basic/optionalquery', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'optional');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should pass query params with a default value', (done) => {
            request('http://localhost:8000/basic/defaultquery?q=foo', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 200);
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

        it('should handle an error thrown with a response', (done) => {
            request('http://localhost:8000/basic/errorthrownwithresponse', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(response.statusCode, 400);
                assert.equal(body, 'Bad Request');
                done();
            });
        });

        it('should handle a resolved promise', (done) => {
            request('http://localhost:8000/basic/resolvedpromise', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, '');
                assert.equal(response.statusCode, 204);
                done();
            });
        });

        it('should handle a resolved promise with a message', (done) => {
            request('http://localhost:8000/basic/resolvedpromisewithmessage', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should handle a resolved promise with a response', (done) => {
            request('http://localhost:8000/basic/resolvedpromisewithresponse', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 201);
                done();
            });
        });

        it('should handle a rejected promise', (done) => {
            request('http://localhost:8000/basic/rejectedpromise', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 500);
                done();
            });
        });

        it('should handle a rejected promise with a message', (done) => {
            request('http://localhost:8000/basic/rejectedpromise', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 500);
                done();
            });
        });

        it('should handle a rejected promise with a response', (done) => {
            request('http://localhost:8000/basic/rejectedpromisewithresponse', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 405);
                done();
            });
        });

        it('should handle a returned response', (done) => {
            request('http://localhost:8000/basic/response', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 201);
                done();
            });
        });

        it('should use the default response code', (done) => {
            request('http://localhost:8000/basic/defaultresponsecode', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 201);
                done();
            });
        });

        it('should use the default errpr code', (done) => {
            request('http://localhost:8000/basic/defaulterrorcode', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'foo');
                assert.equal(response.statusCode, 505);
                done();
            });
        });

    });

    describe('PUT', () => {
        
        it('should PUT', (done) => {
            request.put('http://localhost:8000/basic', {}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'put');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should accept the aliased @PUT', (done) => {
            request.put('http://localhost:8000/alias', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'putalias');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should default to 204 response', (done) => {
            request.put('http://localhost:8000/basic/noresponse', {}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, '');
                assert.equal(response.statusCode, 204);
                done();
            });
        });

        it('should accept the payload', (done) => {
            let payload = {payload: 'foo'};
            request.put('http://localhost:8000/basic/payload', {json: payload}, (err, response, body) => {
                assert.equal(err, null);
                assert.deepEqual(body, payload);
                assert.equal(response.statusCode, 200);
                done();
            });
        });

    });

    describe('POST', () => {

        it('should POST', (done) => {
            request.post('http://localhost:8000/basic', {}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'post');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should accept the aliased @POST', (done) => {
            request.post('http://localhost:8000/alias', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'postalias');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should accept the payload', (done) => {
            let payload = {payload: 'foo'};
            request.post('http://localhost:8000/basic/payload', {json: payload}, (err, response, body) => {
                assert.equal(err, null);
                assert.deepEqual(body, payload);
                assert.equal(response.statusCode, 200);
                done();
            });
        });

    });

    describe('PATCH', () => {

        it('should PATCH', (done) => {
            request.patch('http://localhost:8000/basic', {}, (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'patch');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should accept the aliased @PATCH', (done) => {
            request.patch('http://localhost:8000/alias', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'patchalias');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should accept the payload', (done) => {
            let payload = {payload: 'foo'};
            request.patch('http://localhost:8000/basic/payload', {json: payload}, (err, response, body) => {
                assert.equal(err, null);
                assert.deepEqual(body, payload);
                assert.equal(response.statusCode, 200);
                done();
            });
        });

    });

    describe('DELETE', () => {

        it('should DELETE', (done) => {
            request.delete('http://localhost:8000/basic', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'delete');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

        it('should accept the aliased @GET', (done) => {
            request.delete('http://localhost:8000/alias', (err, response, body) => {
                assert.equal(err, null);
                assert.equal(body, 'deletealias');
                assert.equal(response.statusCode, 200);
                done();
            });
        });

    });
});