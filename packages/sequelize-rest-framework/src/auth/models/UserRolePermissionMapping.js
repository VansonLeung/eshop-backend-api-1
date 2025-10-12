import { DataTypes } from 'sequelize';

export class UserRolePermissionMapping {
    static makeAssociations({ UserRolePermissionMapping, UserRole, UserPermission }) {
        // UserRolePermissionMapping belongs to UserRole
        UserRolePermissionMapping.belongsTo(UserRole, {
            foreignKey: 'userRoleId',
            as: 'userRole',
        });

        // UserRolePermissionMapping belongs to UserPermission
        UserRolePermissionMapping.belongsTo(UserPermission, {
            foreignKey: 'userPermissionId',
            as: 'userPermission',
        });
    }

    static makeSchema() {
        return {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            userRoleId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            userPermissionId: {
                type: DataTypes.UUID,
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