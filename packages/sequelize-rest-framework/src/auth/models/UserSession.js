import { DataTypes } from 'sequelize';

export class UserSession {
    static makeAssociations({ UserSession, User, UserCredential }) {
        // UserSession belongs to User
        UserSession.belongsTo(User, {
            foreignKey: 'userId',
            as: 'user',
        });

        // UserSession belongs to UserCredential
        UserSession.belongsTo(UserCredential, {
            foreignKey: 'userCredentialId',
            as: 'userCredential',
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
            userCredentialId: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            accessToken: {
                type: DataTypes.STRING(256),
                allowNull: false,
                unique: true,
            },
            refreshToken: {
                type: DataTypes.STRING(256),
                allowNull: false,
                unique: true,
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('active', 'expired', 'revoked'),
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