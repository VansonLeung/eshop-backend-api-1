import { DataTypes } from 'sequelize';

export class User {
    static makeAssociations({ User, UserRole, UserCredential, UserSession }) {
        // User belongs to UserRole
        User.belongsTo(UserRole, {
            foreignKey: 'userRoleId',
            as: 'userRole',
        });

        // User has many UserCredentials
        User.hasMany(UserCredential, {
            foreignKey: 'userId',
            as: 'credentials',
        });

        // User has many UserSessions
        User.hasMany(UserSession, {
            foreignKey: 'userId',
            as: 'sessions',
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
                allowNull: true,
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
            status: {
                type: DataTypes.ENUM('active', 'inactive', 'suspended'),
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