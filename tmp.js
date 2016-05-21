System.register("dto/index", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DTO;
    return {
        setters:[],
        execute: function() {
            class DTO {
            }
            exports_1("default", DTO);
        }
    }
});
System.register("request/index", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var RequestConfig;
    return {
        setters:[],
        execute: function() {
            class RequestConfig {
                constructor() {
                    this.params = {};
                    this.query = {};
                    this.resources = {};
                }
            }
            exports_2("default", RequestConfig);
        }
    }
});
System.register("route/manager", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var RouteManager;
    return {
        setters:[],
        execute: function() {
            class RouteManager {
                static registerRoute(method, path, object, key) {
                    if (object.hasOwnProperty(key)) {
                        let existingRoute = this.getRoute(method, path);
                        if (!existingRoute) {
                            this.routes.push({
                                method: method,
                                path: path,
                                object: object,
                                key: key
                            });
                        }
                        else {
                            let error = `Unable to register route: ${method} > ${path} to ${object.constructor.name}.${key}. This path is already registerd to ${existingRoute.object.constructor.name}.${key}`;
                            throw new Error(error);
                        }
                    }
                    else {
                        let error = `Unable to register route: ${method} > ${path} to ${object.constructor.name}.${key}. ${key} does not exist on ${object.constructor.name}. Instead of calling RouteManager.registerRoute directly, use the @Route decorator.`;
                        throw new Error(error);
                    }
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
            }
            RouteManager.routes = [];
            exports_3("default", RouteManager);
        }
    }
});
System.register("index", [], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var ExpressKit;
    return {
        setters:[],
        execute: function() {
            class ExpressKit {
                static start(config) {
                    this.server.listen(config.port, () => {
                        console.log(`Started server on port ${config.port}`);
                    });
                }
            }
            exports_4("default", ExpressKit);
        }
    }
});
