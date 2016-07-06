let request = require('request');
let assert = require('chai').assert;

describe('Middleware', () => {

  describe('Routers', () => {

    it('should use the router middleware', (done) => {

      request.get('http://localhost:8000/middleware/router', (err, response, body) => {
        assert.equal(err, null);
        assert.equal(body, 'router');
        assert.equal(response.statusCode, 200);
        done();
      });

    });

  });

  describe('Routes', () => {

    it('should use the route middleware', (done) => {

      request.get('http://localhost:8000/middleware/route', (err, response, body) => {
        assert.equal(err, null);
        assert.equal(body, 'route');
        assert.equal(response.statusCode, 200);
        done();
      });

    });

  });

});