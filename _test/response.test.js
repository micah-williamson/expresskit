let request = require('request');
let assert = require('chai').assert;

describe('Response', () => {

    describe('Defaults', () => {
      let defaults = [
        {
          uri: '/response/default/ok',
          code: 200,
          response: 'Ok'
        },
        {
          uri: '/response/default/created',
          code: 201,
          response: 'Created'
        },
        {
          uri: '/response/default/accepted',
          code: 202,
          response: 'Accepted'
        },
        {
          uri: '/response/default/none',
          code: 204,
          response: ''
        },
        {
          uri: '/response/default/badRequest',
          code: 400,
          response: 'Bad Request'
        },
        {
          uri: '/response/default/unauthorized',
          code: 401,
          response: 'Unauthorized'
        },
        {
          uri: '/response/default/paymentRequired',
          code: 402,
          response: 'Payment Required'
        },
        {
          uri: '/response/default/forbidden',
          code: 403,
          response: 'Forbidden'
        },
        {
          uri: '/response/default/notFound',
          code: 404,
          response: 'Not Found'
        },
        {
          uri: '/response/default/methodNotAllowed',
          code: 405,
          response: 'Method Not Allowed'
        },
        {
          uri: '/response/default/notAcceptable',
          code: 406,
          response: 'Not Acceptable'
        },
        {
          uri: '/response/default/conflict',
          code: 409,
          response: 'Conflict'
        },
        {
          uri: '/response/default/noLongerAvailable',
          code: 410,
          response: 'No Longer Available'
        },
        {
          uri: '/response/default/error',
          code: 500,
          response: 'Internal Server Error'
        },
        {
          uri: '/response/default/notImplemented',
          code: 501,
          response: 'Not Implemented'
        },
        {
          uri: '/response/default/badgateway',
          code: 502,
          response: 'Bad Gateway'
        },
        {
          uri: '/response/default/temporarilyunavailable',
          code: 503,
          response: 'Temporarily Unavailable'
        },
        {
          uri: '/response/default/gatewaytimeout',
          code: 504,
          response: 'Gateway Timeout'
        }
      ];

      defaults.forEach((def) => {
        it(`should respond with the default value '${def.response}' and code '${def.code}'`, (done) => {
          request(`http://localhost:8000${def.uri}`, (err, response, body) => {
            assert.equal(err, null);
            assert.equal(body, def.response);
            assert.equal(response.statusCode, def.code);
            done();
          });
        });
      });
    });

    describe('ResponseCode and ErrorCode', () => {

      it('should use the ResponseCode if defined', (done) => {
        request(`http://localhost:8000/response/code`, (err, response, body) => {
          assert.equal(err, null);
          assert.equal(body, 'foo');
          assert.equal(response.statusCode, 402);
          done();
        });
      });

      it('should use the ErrorCode if defined', (done) => {
        request(`http://localhost:8000/response/errorCode`, (err, response, body) => {
          assert.equal(err, null);
          assert.equal(body, 'foo');
          assert.equal(response.statusCode, 402);
          done();
        });
      });

      it('should use the ErrorCode from a rejected rule', (done) => {
        request(`http://localhost:8000/response/errorCodeRule`, (err, response, body) => {
          assert.equal(err, null);
          assert.equal(body, 'bar');
          assert.equal(response.statusCode, 402);
          done();
        });
      });

      it('should use the ErrorCode from a rejected resource', (done) => {
        request(`http://localhost:8000/response/errorCodeResource`, (err, response, body) => {
          assert.equal(err, null);
          assert.equal(body, 'bar');
          assert.equal(response.statusCode, 402);
          done();
        });
      });

    });


});