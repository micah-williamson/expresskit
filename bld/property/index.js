"use strict";
const manager_1 = require('./manager');
(function (PropertyType) {
    PropertyType[PropertyType["Body"] = 0] = "Body";
    PropertyType[PropertyType["Param"] = 1] = "Param";
    PropertyType[PropertyType["Query"] = 2] = "Query";
    PropertyType[PropertyType["Header"] = 3] = "Header";
    PropertyType[PropertyType["Auth"] = 4] = "Auth";
})(exports.PropertyType || (exports.PropertyType = {}));
var PropertyType = exports.PropertyType;
;
function Body() {
    return function (object, method, index) {
        let property = {
            type: PropertyType.Body,
            object: object,
            method: method,
            name: undefined,
            index: index,
            optional: false,
            defaultValue: undefined
        };
        manager_1.default.registerProperty(property);
    };
}
exports.Body = Body;
function Query(name) {
    return function (object, method, index) {
        registerProperty(name, object, method, index, PropertyType.Query);
    };
}
exports.Query = Query;
function Param(name) {
    return function (object, method, index) {
        registerProperty(name, object, method, index, PropertyType.Param);
    };
}
exports.Param = Param;
function Header(name) {
    return function (object, method, index) {
        registerProperty(name, object, method, index, PropertyType.Header);
    };
}
exports.Header = Header;
function registerProperty(name, object, method, index, type) {
    let optional = false;
    let defaultValue;
    if (name[name.length - 1] === '?') {
        optional = true;
        name = name.substr(0, name.length - 1);
    }
    else {
        let defaultParts = name.split('=');
        if (defaultParts.length === 2) {
            name = defaultParts[0];
            defaultValue = defaultParts[1];
        }
    }
    let property = {
        type: type,
        object: object,
        method: method,
        name: name,
        index: index,
        optional: optional,
        defaultValue: defaultValue
    };
    manager_1.default.registerProperty(property);
}
