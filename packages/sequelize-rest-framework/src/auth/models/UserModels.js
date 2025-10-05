import { DataTypes } from "sequelize";
import {
    BasicAttributes,
    DatedStatusAttributes,
    DatedSoftDeleteStatusAttributes,
} from '../../models/index.js';
import { AssociationHelpers } from '../../models/helpers/AssociationHelpers.js';

/**
 * User Model Schema
 */
export const UserModel = {
    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            userRoleId: {
                type: DataTypes.UUID,
                index: true,
            },
            username: {
                type: DataTypes.STRING(64),
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING(256),
                allowNull: false,
                unique: true,
            },
            firstName: DataTypes.STRING(128),
            lastName: DataTypes.STRING(128),
        }
    },

    makeAssociations: ({ User, UserRole, UserCredential, UserSession, UserPermission }) => {
        // User belongs to Role
        AssociationHelpers.belongsTo(User, UserRole, {
            foreignKey: 'userRoleId',
            as: 'userRole',
        });

        // User has many Credentials
        AssociationHelpers.hasMany(User, UserCredential, {
            foreignKey: 'userId',
            as: 'credentials',
        });

        // User has many Sessions
        AssociationHelpers.hasMany(User, UserSession, {
            foreignKey: 'userId',
            as: 'sessions',
        });
    },
};

/**
 * UserRole Model Schema
 */
export const UserRoleModel = {
    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            code: {
                type: DataTypes.STRING(64),
                allowNull: false,
                unique: true,
            },
            level: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: 'Higher level = more permissions',
            },
        }
    },

    makeAssociations: ({ User, UserRole, UserRolePermissionMapping }) => {
        // Role has many Users
        AssociationHelpers.hasMany(UserRole, User, {
            foreignKey: 'userRoleId',
            as: 'users',
        });

        // Role has many Permission mappings
        AssociationHelpers.hasMany(UserRole, UserRolePermissionMapping, {
            foreignKey: 'userRoleId',
            as: 'rolePermissions',
        });
    },
};

/**
 * UserPermission Model Schema
 */
export const UserPermissionModel = {
    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            code: {
                type: DataTypes.STRING(64),
                allowNull: false,
                unique: true,
            },
            resource: {
                type: DataTypes.STRING(64),
                comment: 'Resource/Model name (e.g., "Product", "Order")',
            },
            action: {
                type: DataTypes.STRING(32),
                comment: 'Action name (e.g., "create", "read", "update", "delete")',
            },
        }
    },

    makeAssociations: ({ UserPermission, UserRolePermissionMapping }) => {
        // Permission has many Role mappings
        AssociationHelpers.hasMany(UserPermission, UserRolePermissionMapping, {
            foreignKey: 'userPermissionId',
            as: 'permissionRoles',
        });
    },
};

/**
 * UserRolePermissionMapping Model Schema
 */
export const UserRolePermissionMappingModel = {
    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            userRoleId: {
                type: DataTypes.UUID,
                allowNull: false,
                index: true,
            },
            userPermissionId: {
                type: DataTypes.UUID,
                allowNull: false,
                index: true,
            },
        }
    },

    makeAssociations: ({ UserRole, UserPermission, UserRolePermissionMapping }) => {
        // Mapping belongs to Role
        AssociationHelpers.belongsTo(UserRolePermissionMapping, UserRole, {
            foreignKey: 'userRoleId',
            as: 'role',
        });

        // Mapping belongs to Permission
        AssociationHelpers.belongsTo(UserRolePermissionMapping, UserPermission, {
            foreignKey: 'userPermissionId',
            as: 'permission',
        });
    },
};

/**
 * UserCredential Model Schema
 */
export const UserCredentialModel = {
    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                index: true,
            },
            type: {
                type: DataTypes.ENUM('password', 'google', 'facebook', 'twitter', 'github'),
                defaultValue: 'password',
            },
            password: {
                type: DataTypes.STRING(256),
                allowNull: true,  // Null for OAuth
            },
            provider: DataTypes.STRING(64),
            providerId: DataTypes.STRING(256),
        }
    },

    makeAssociations: ({ User, UserCredential, UserSession }) => {
        // Credential belongs to User
        AssociationHelpers.belongsTo(UserCredential, User, {
            foreignKey: 'userId',
            as: 'user',
        });

        // Credential has many Sessions
        AssociationHelpers.hasMany(UserCredential, UserSession, {
            foreignKey: 'userCredentialId',
            as: 'sessions',
        });
    },
};

/**
 * UserSession Model Schema
 */
export const UserSessionModel = {
    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                index: true,
            },
            userCredentialId: {
                type: DataTypes.UUID,
                index: true,
            },
            accessToken: {
                type: DataTypes.STRING(256),
                allowNull: false,
                unique: true,
                index: true,
            },
            refreshToken: {
                type: DataTypes.STRING(256),
                allowNull: false,
                unique: true,
                index: true,
            },
            expiresAt: {
                type: DataTypes.DATE,
                index: true,
            },
            ipAddress: DataTypes.STRING(45),
            userAgent: DataTypes.TEXT,
        }
    },

    makeAssociations: ({ User, UserCredential, UserSession }) => {
        // Session belongs to User
        AssociationHelpers.belongsTo(UserSession, User, {
            foreignKey: 'userId',
            as: 'user',
        });

        // Session belongs to Credential
        AssociationHelpers.belongsTo(UserSession, UserCredential, {
            foreignKey: 'userCredentialId',
            as: 'credential',
        });
    },
};
