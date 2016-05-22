"use strict";
const requestHandler_1 = require('./requestHandler');
class RouteManager {
    static registerRoute(method, path, object, key) {
        if (object.hasOwnProperty(key)) {
            let existingRoute = this.getRoute(method, path);
            if (!existingRoute) {
                this.routes.push({
                    method: method,
                    path: path,
                    object: object,
                    key: key,
                    properties: object[key].properties || []
                });
            }
            else {
                let error = `Unable to register route: ${method} > ${path} to ${object.prototype.constructor.name}.${key}. This path is already registered to ${existingRoute.object.prototype.constructor.name}.${key}`;
                throw new Error(error);
            }
        }
        else {
            let error = `Unable to register route: ${method} > ${path} to ${object.prototype.constructor.name}.${key}. ${key} does not exist on ${object.prototype.constructor.name}. Instead of calling RouteManager.registerRoute directly, use the @Route decorator.`;
            throw new Error(error);
        }
    }
    static registerRouteProperty(object, method, property) {
        let properties = object[method].properties = object[method].properties || [];
        let existingProperty = false;
        properties.forEach((prop) => {
            if (prop.type === property.type && prop.name === property.name) {
                existingProperty = true;
            }
        });
        if (!existingProperty) {
            properties.push(property);
        }
        else {
            let error = `Unable to register signature property: ${property.type} ${property.name} to ${object.prototype.constructor.name}.${method}. This Type/Name combination already exists on the route.`;
            throw new Error(error);
        }
    }
    static bindRoutes(application) {
        this.routes.forEach(route => {
            let expressMethod = this.getExpressMethod(application, route.method);
            expressMethod.call(application, route.path, requestHandler_1.default.requestHandlerFactory(route));
        });
    }
    static getRoute(method, path) {
        let route = null;
        this.routes.forEach((rt) => {
            if (rt.method === method && rt.path === path) {
                route = rt;
            }
        });
        return route;
    }
    static getRouteByClass(object, method) {
        let route = null;
        this.routes.forEach((rt) => {
            if (rt.object === object && rt.key === method) {
                route = rt;
            }
        });
        return route;
    }
    static getRouteProperty(route, type, name) {
        let property;
        route.properties.forEach((prop) => {
            if (prop.type === type && prop.name === name) {
                property = prop;
            }
        });
        return property;
    }
    static getExpressMethod(application, method) {
        switch (method) {
            case 'GET':
                return application.get;
            case 'PUT':
                return application.put;
            case 'POST':
                return application.post;
            case 'DELETE':
                return application.delete;
        }
        return;
    }
}
RouteManager.routes = [];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RouteManager;
