import { DataTypes } from 'sequelize';

export class UserCredential {
    static makeAssociations({ UserCredential, User }) {
        // UserCredential belongs to User
        UserCredential.belongsTo(User, {
            foreignKey: 'userId',
            as: 'user',
        });
    }

    static makeSchema() {
        return {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('password', 'google', 'facebook', 'twitter', 'github'),
                defaultValue: 'password',
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(256),
                allowNull: false,
            },
            isDisabled: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
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