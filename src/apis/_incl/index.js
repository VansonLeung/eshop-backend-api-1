// Import from library
import {
    GenericCRUD,
    GenericAssociations,
    RequestResponseMiddleware,
    RouterWithMeta,
} from '../../../packages/sequelize-rest-framework/src/index.js';

// Re-export with legacy names for backward compatibility
export const _APIGenericCRUD = GenericCRUD;
export const _APIGenericAssociations = GenericAssociations;
export const _APIGenericUseRequestResponse = RequestResponseMiddleware;
export const _routerWithMeta = RouterWithMeta;

// Keep app-specific middleware
export { _APIGenericMiddlewaresACL } from './_APIGenericMiddlewaresACL.js';
