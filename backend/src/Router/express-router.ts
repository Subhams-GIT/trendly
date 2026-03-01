import type { ServerResponse } from "node:http";
import type { customRequest } from "../global";
// import u from "url";

export type next = () => void;

type Controller = (req: customRequest, res: ServerResponse) => void;
type middleware = (req: customRequest, res: ServerResponse, next: next) => void;

export class Router {
    public router: Map<string, Controller> = new Map();
    public middleware: middleware[] = [];

    // register controller
    use(route: string, controller: Controller) {
        this.router.set(route, controller);
    }

    // register middleware
    useMiddleware(middlewarefunction: middleware) {
        this.middleware.push(middlewarefunction);
    }

    handle(req: customRequest, res: ServerResponse) {
        const Url = new URL(req.url ?? "", "http://localhost:3002");
        const path = Url.pathname;

        const controller = this.router.get(path);

        if (!controller) {
            res.statusCode = 400;
            res.end("controller not found");
            return;
        }

        const queryparams = Url.searchParams;
        const pa = new Map<string, string>();
        queryparams.forEach((value, key) => {
            pa.set(key, value);
        });
        req.queryparams = pa;
        let index = 0;

        const next: next = () => {
            if (index < this.middleware.length ) {
                const fn = this.middleware[index++];
                console.log(fn)
                if(fn )
                fn(req, res, next);
            } else {
                console.log(controller)
                controller(req, res);
            }
        };

        next(); // start the chain
    }
}
