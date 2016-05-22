"use strict";
class IAuthenticationResource {
    constructor() {
        this.isDefault = false;
    }
}
exports.IAuthenticationResource = IAuthenticationResource;
class AuthenticationManager {
    static registerAuthenticationResource(resource) {
        let defaultResource = this.getDefault();
        let namedResource = this.getResourceByName(resource.name);
        if (resource.isDefault && defaultResource) {
            throw new Error(`Unable to register authentication at ${resource.object.prototype.constructor.name}.${resource.method} as a default authentication resolution method. ${defaultResource.object.prototype.constructor.name}.${defaultResource.method} is already the default authentication method.`);
        }
        if (namedResource) {
            console.log(resource.object.prototype);
            throw new Error(`Unable to register authentication at ${resource.object.prototype.constructor.name}.${resource.method} with the name '${resource.name}'. ${namedResource.object.prototype.constructor.name}.${namedResource.method} has already registered this name.`);
        }
        this.resources.push(resource);
    }
    static getResourceByName(nm) {
        let resource = null;
        this.resources.forEach((res) => {
            if (res.name === nm) {
                resource = res;
            }
        });
        return resource;
    }
    static getDefault() {
        let resource = null;
        this.resources.forEach((res) => {
            if (res.isDefault) {
                resource = res;
            }
        });
        return resource;
    }
    static hasDefault() {
        let defaultFound = false;
        this.resources.forEach((resource) => {
            if (resource.isDefault) {
                defaultFound = true;
            }
        });
        return defaultFound;
    }
}
AuthenticationManager.resources = [];
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthenticationManager;
