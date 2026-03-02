import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
import { parseUrl } from "../utils/parse_url";
/*
const router=express.router();
router.use(authmiddleware)
router.get("/api/v1/health",healthcheckcontroller)
router.post()
*/
export type next = (req: customRequest, res: ServerResponse) => void;
export type Controller = (req: customRequest, res: ServerResponse) => void;
export type middleware = (req: customRequest, res: ServerResponse, next: next) => void;
export type METHODS = "GET" | "POST" | "PUT"
interface RouteHandler {
    controller: Controller;
    middlewares: middleware[];
}
export class Router {
    public routes: Map<string, Map<METHODS, RouteHandler>> = new Map();
    public globalMiddlewares: middleware[] = [];

    useGlobal(mw: middleware) {
        this.globalMiddlewares.push(mw);
    }
    use(method: METHODS, route: string, controller: Controller, ...middlewares: middleware[]) {
        if (!this.routes.has(route)) {
            this.routes.set(route, new Map());
        }

        this.routes.get(route)!.set(method, {
            controller,
            middlewares
        });
    }

    handle(req: customRequest, res: ServerResponse) {
        const { pathname, query, params } = parseUrl(req.url as string, "http://localhost:3002");
        req.queryparams = new Map(Object.entries(query));
        req.searchparams = params;
        const method = req.method as METHODS;

        const routeMap = this.routes.get(pathname);
        if (!routeMap) {
            res.statusCode = 404;
            return res.end("Not Found");
        }

        const handler = routeMap.get(method);
        if (!handler) {
            res.statusCode = 405;
            return res.end("Method Not Allowed");
        }

        const stack = [
            ...this.globalMiddlewares,
            ...handler.middlewares,
            handler.controller
        ]

        let index = 0;

        const next = () => {
            const fn = stack[index++];
            if (!fn) return;

            if (index === stack.length) {
                return (fn as Controller)(req, res);
            }

            (fn as middleware)(req, res, next);
        };

        next();
    }
    get(route: string, controller: Controller, ...middleware: middleware[]) {
        this.use("GET", route, controller, ...middleware);
    }

    post(route: string, controller: Controller,...middleware:middleware[]) {
         this.use("POST", route, controller, ...middleware);
    }

}
