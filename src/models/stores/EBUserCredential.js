import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBUserCredential = {
    makeAssociations: ({Me, User}) => {
        AssociationHelpers.belongsTo(Me, User, {
            foreignKey: 'userId',
            as: 'user',
        });
        AssociationHelpers.hasMany(User, Me, {
            foreignKey: 'userId',
            as: 'credentials',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            type: DataTypes.ENUM({
                values: ["password", "google", "facebook", "twitter", "github"],
            }),
            password: {
                type: DataTypes.STRING(256),
                allowNull: false,
            },
            isDisabled: DataTypes.BOOLEAN,    
        }
    },
};
