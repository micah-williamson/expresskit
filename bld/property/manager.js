"use strict";
const index_1 = require('./index');
const responseHandler_1 = require('../route/responseHandler');
const manager_1 = require('../authentication/manager');
class PropertyManager {
    static registerProperty(property) {
        let existingProperty = this.getProperty(property.object, property.method, property.name, property.type);
        if (existingProperty) {
            throw new Error(`Unable to register Property (type:'${property.type}') '${property.name}' to ${property.object.prototype.constructor.name}.${property.method}. This property is already registered to this class method.`);
        }
        this.properties.push(property);
    }
    static getPropertyValues(properties, config) {
        let returnPromises = [];
        properties.forEach((prop) => {
            switch (prop.type) {
                case index_1.PropertyType.Body:
                    returnPromises[prop.index] = Promise.resolve(config.request.body);
                    break;
                case index_1.PropertyType.Param:
                    returnPromises[prop.index] = this.resolveParam(prop, config);
                    break;
                case index_1.PropertyType.Query:
                    returnPromises[prop.index] = this.resolveQuery(prop, config);
                    break;
                case index_1.PropertyType.Header:
                    returnPromises[prop.index] = this.resolveHeader(prop, config);
                    break;
                case index_1.PropertyType.Auth:
                    returnPromises[prop.index] = Promise.resolve(this.resolveAuthentication(prop, config));
                    break;
            }
        });
        let returnValues = [];
        for (var i = 0; i < returnPromises.length; i++) {
            (function (i, promise) {
                promise.then((val) => {
                    return returnValues[i] = val;
                });
            })(i, returnPromises[i]);
        }
        return Promise.all(returnPromises).then(() => {
            for (var i = 0; i < returnValues.length; i++) {
                let returnValue = returnValues[i];
            }
            return new responseHandler_1.Response(200, returnValues);
        });
    }
    static resolveQuery(property, config) {
        return new Promise((resolve, reject) => {
            let val = config.request.query[property.name];
            if (val) {
                resolve(val);
            }
            else {
                if (property.optional) {
                    resolve();
                }
                else if (property.defaultValue !== undefined) {
                    resolve(property.defaultValue);
                }
                else {
                    reject(new responseHandler_1.Response(400, `Required query parameter missing: ${property.name}`));
                }
            }
        });
    }
    static resolveParam(property, config) {
        return new Promise((resolve, reject) => {
            let val = config.request.params[property.name];
            if (val) {
                resolve(val);
            }
            else {
                if (property.optional) {
                    resolve();
                }
                else if (property.defaultValue !== undefined) {
                    resolve(property.defaultValue);
                }
                else {
                    reject(new responseHandler_1.Response(400, `Required parameter missing: ${property.name}`));
                }
            }
        });
    }
    static resolveHeader(property, config) {
        return new Promise((resolve, reject) => {
            let val = config.request.header(property.name);
            if (val) {
                resolve(val);
            }
            else {
                if (property.optional) {
                    resolve();
                }
                else if (property.defaultValue !== undefined) {
                    resolve(property.defaultValue);
                }
                else {
                    reject(new responseHandler_1.Response(400, `Required header missing: ${property.name}`));
                }
            }
        });
    }
    static resolveAuthentication(prop, config) {
        let name = prop.name;
        let authResource;
        if (name) {
            authResource = manager_1.default.getResourceByName(name);
        }
        else {
            authResource = manager_1.default.getDefault();
        }
        let propertyValues = this.getProperties(authResource.object, authResource.method);
        return this.getPropertyValues(propertyValues, config).then((response) => {
            if (response.type === responseHandler_1.ResponseType.Error) {
                return response;
            }
            return Promise.resolve(authResource.object[authResource.method].apply(authResource, response.data))
                .catch((response) => {
                if (!(response instanceof responseHandler_1.Response)) {
                    return new responseHandler_1.Response(401, response);
                }
            });
        });
    }
    static getProperties(object, method) {
        let properties = [];
        this.properties.forEach((property) => {
            if (property.object === object && property.method === method) {
                properties.push(property);
            }
        });
        return properties;
    }
    static getProperty(object, method, name, type) {
        let property = null;
        this.properties.forEach((prop) => {
            if (prop.object === object && prop.method === method && prop.name === name && prop.type === type) {
                property = prop;
            }
        });
        return property;
    }
}
PropertyManager.properties = [];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PropertyManager;
