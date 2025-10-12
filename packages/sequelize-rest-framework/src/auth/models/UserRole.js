import { DataTypes } from 'sequelize';

export class UserRole {
    static makeAssociations({ UserRole, User, UserRolePermissionMapping }) {
        // UserRole has many Users
        UserRole.hasMany(User, {
            foreignKey: 'userRoleId',
            as: 'users',
        });

        // UserRole has many UserRolePermissionMappings
        UserRole.hasMany(UserRolePermissionMapping, {
            foreignKey: 'userRoleId',
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