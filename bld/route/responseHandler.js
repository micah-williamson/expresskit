"use strict";
(function (ResponseType) {
    ResponseType[ResponseType["Success"] = 0] = "Success";
    ResponseType[ResponseType["Error"] = 1] = "Error";
})(exports.ResponseType || (exports.ResponseType = {}));
var ResponseType = exports.ResponseType;
;
class Response {
    constructor(httpCode, data) {
        this.httpCode = httpCode;
        this.data = data;
        if (httpCode >= 400) {
            this.type = ResponseType.Error;
        }
        else {
            this.type = ResponseType.Success;
        }
    }
}
exports.Response = Response;
class ResponseHandlerService {
    static handleResponse(route, expressResponse, methodResponse) {
        if (methodResponse && methodResponse.then) {
            methodResponse.then((payload) => {
                let response = this.convertSuccessResponse(payload);
                this.sendResponse(response, expressResponse);
            }).catch((payload) => {
                let response = this.convertErrorResponse(payload);
                this.sendResponse(response, expressResponse);
            });
        }
        else {
            let response = this.convertSuccessResponse(methodResponse);
            this.sendResponse(response, expressResponse);
        }
    }
    static convertSuccessResponse(data) {
        if (data instanceof Response) {
            return data;
        }
        return new Response(data !== undefined ? 200 : 204, data);
    }
    static convertErrorResponse(data) {
        if (data instanceof Response) {
            return data;
        }
        return new Response(500, data);
    }
    static sendResponse(response, expressResponse) {
        expressResponse.status(response.httpCode).send(response.data);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ResponseHandlerService;
