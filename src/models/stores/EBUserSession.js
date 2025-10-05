import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBUserSession = {
    makeAssociations: ({Me, User, UserCredential}) => {
        AssociationHelpers.hasMany(User, Me, {
            foreignKey: 'userId',
            as: 'sessions',
        });
        AssociationHelpers.belongsTo(Me, User, {
            foreignKey: 'userId',
            as: 'user',
        });

        AssociationHelpers.hasMany(UserCredential, Me, {
            foreignKey: 'userCredentialId',
            as: 'sessions',
        });
        AssociationHelpers.belongsTo(Me, UserCredential, {
            foreignKey: 'userCredentialId',
            as: 'userCredential',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            userId: DataTypes.UUID,
            userCredentialId: DataTypes.UUID,
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
        }
    },
};

