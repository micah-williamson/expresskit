"use strict";
const manager_1 = require('../property/manager');
const responseHandler_1 = require('./responseHandler');
const request_1 = require('../request');
class RequestHandlerService {
    static generateRequestConfig(request) {
        let config = new request_1.default();
        config.request = request;
        config.url = request.path;
        config.params = request.params;
        config.query = request.query;
        return config;
    }
    static requestHandlerFactory(route) {
        return (request, expressResponse) => {
            let config = this.generateRequestConfig(request);
            let properties = manager_1.default.getProperties(route.object, route.key);
            manager_1.default.getPropertyValues(properties, config).then((response) => {
                if (response.type === responseHandler_1.ResponseType.Success) {
                    let object = route.object;
                    let method = route.key;
                    let objectMethod = object[method];
                    let data = objectMethod.apply(object, response.data);
                    responseHandler_1.default.handleResponse(route, expressResponse, data);
                }
                else {
                    responseHandler_1.default.handleResponse(route, expressResponse, response);
                }
            }).catch((response) => {
                responseHandler_1.default.handleResponse(route, expressResponse, responseHandler_1.default.convertErrorResponse(response));
            });
        };
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RequestHandlerService;
