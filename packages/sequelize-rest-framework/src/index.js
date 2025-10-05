// API exports
export {
    GenericCRUD,
    GenericAssociations,
    RequestResponseMiddleware,
    RouterWithMeta,
    recursiveMassageWhereClause,
    recursiveMassageIncludeClause,
} from './api/index.js';

// Model Registry
export { modelRegistry } from './ModelRegistry.js';

// Plugin exports
export {
    PluginManager,
    pluginManager,
    ACLPlugin,
    createACLConfig,
    exampleACLConfig,
} from './plugins/index.js';

// Model exports
export {
    // Attributes
    BasicAttributes,
    BasicSeqIdlessAttributes,
    CodeAttributes,
    ContactAttributes,
    ContentAttributes,
    DatedStatusAttributes,
    DatedSoftDeleteStatusAttributes,
    OrderAttributes,
    OrderItemAttributes,
    ParentChildAttributes,
    ProductVariantAttributes,
    // Associations
    ContentAssociations,
    ParentChildAssociations,
    ProductVariantAssociations,
    // Helpers
    SchemaToIndexes,
    AssociationHelpers,
    configureConstraints,
    // Config
    Settings,
} from './models/index.js';

// Auth exports
export {
    AuthSystem,
    UserModel,
    UserRoleModel,
    UserPermissionModel,
    UserRolePermissionMappingModel,
    UserCredentialModel,
    UserSessionModel,
    UserAuthService,
    UserACLService,
    AuthMiddleware,
    AuthRoutes,
} from './auth/index.js';
