import { DataTypes } from 'sequelize';

export class UserPermission {
    static makeAssociations({ UserPermission, UserRolePermissionMapping }) {
        // UserPermission has many UserRolePermissionMappings
        UserPermission.hasMany(UserRolePermissionMapping, {
            foreignKey: 'userPermissionId',
            as: 'rolePermissions',
        });
    }

    static makeSchema() {
        return {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            code: {
                type: DataTypes.STRING(64),
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            resource: {
                type: DataTypes.STRING(128),
                allowNull: false,
            },
            action: {
                type: DataTypes.STRING(64),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                defaultValue: 'active',
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            deletedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        };
    }
}