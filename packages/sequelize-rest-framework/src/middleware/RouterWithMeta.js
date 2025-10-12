import { METHODS } from 'node:http';

export class RouterWithMeta {
    constructor({router, meta}) {
        this.router = router;
        this.meta = meta;
        this.routerWithMeta = {};

        this.initializeMethods();
    }

    initializeMethods() {
        for (const methodName of METHODS) {
            const method = methodName.toLowerCase();
            this.routerWithMeta[method] = (...args) => {
                const path = args[0];
                const metadata = Object.assign({}, args[1]);

                this.meta[`${method.toUpperCase()} ${path}`] = {...metadata};

                const routerArguments = [...args];
                routerArguments.splice(1, 1);

                return this.router[method].apply(this.router, routerArguments);
            };
        }
    }

    getRouter() {
        return this.routerWithMeta;
    }
}