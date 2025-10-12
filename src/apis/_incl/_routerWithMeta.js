import { RouterWithMeta } from '../../../packages/sequelize-rest-framework/src/middleware/RouterWithMeta.js';

export const _routerWithMeta = ({router, meta}) => {
    const routerWithMetaInstance = new RouterWithMeta({router, meta});
    return routerWithMetaInstance.getRouter();
};
