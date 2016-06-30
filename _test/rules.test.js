require('./bld/route/response.js');

let request = require('request');
let assert = require('chai').assert;

describe('Rules', () => {

  describe('Failing', () => {

    it('should fail the request with a 500 error', (done) => {

      request('http://localhost:8000/rules/fail', (err, response, body) => {
        assert.equal(err, null);
        assert.equal(body, 'bar');
        assert.equal(response.statusCode, 500);
        done();
      });

    });

    it('should fail the request with a custom err response resolved', (done) => {

      request('http://localhost:8000/rules/failcustomresponse', (err, response, body) => {
        assert.equal(err, null);
        assert.equal(body, 'Test');
        assert.equal(response.statusCode, 400);
        done();
      });

    });

    it('should fail the request with a custom err response rejected', (done) => {

      request('http://localhost:8000/rules/failcustomresponserejected', (err, response, body) => {
        assert.equal(err, null);
        assert.equal(body, 'Test');
        assert.equal(response.statusCode, 400);
        done();
      });

    });

  });

  describe('Passing', () => {

    it('should pass the request with a 200 response', (done) => {

      request('http://localhost:8000/rules/pass', (err, response, body) => {
        assert.equal(err, null);
        assert.equal(body, 'foo');
        assert.equal(response.statusCode, 200);
        done();
      });

    });

  });

  describe('AND/OR', () => {

    it('should pass if at least one OR rules pass', (done) => {

      request('http://localhost:8000/rules/or/pass', (err, response, body) => {
        assert.equal(err, null);
        assert.equal(body, 'foo');
        assert.equal(response.statusCode, 200);
        done();
      });

    });

    it('should fail if all OR rules fail', (done) => {

      request('http://localhost:8000/rules/or/fail', (err, response, body) => {
        assert.equal(err, null);
        assert.equal(body, 'bar');
        assert.equal(response.statusCode, 500);
        done();
      });

    });

    it('should pass if all AND rules pass', (done) => {

      request('http://localhost:8000/rules/and/pass', (err, response, body) => {
        assert.equal(err, null);
        assert.equal(body, 'foo');
        assert.equal(response.statusCode, 200);
        done();
      });

    });

    it('should fail if at leas one AND rule fails', (done) => {

      request('http://localhost:8000/rules/and/fail', (err, response, body) => {
        assert.equal(err, null);
        assert.equal(body, 'bar');
        assert.equal(response.statusCode, 500);
        done();
      });

    });

  });

  describe('Complex', () => {

    it('should handle complex rules by passing params, queries, bodies, and auths', (done) => {
      request.post('http://localhost:8000/rules/complex/a?b=b', {headers: {c: 'c'}, json: {d: 'd'}}, (err, response, body) => {
        assert.equal(err, null);
        assert.equal(body, 'fooauthabcd');
        assert.equal(response.statusCode, 500);
        done();
      });
    });

  });

});