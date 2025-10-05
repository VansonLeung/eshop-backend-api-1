import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    ContentAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBUserPayment = {
    makeAssociations: ({Me, User}) => {
        AssociationHelpers.belongsTo(Me, User, {
            foreignKey: 'userId',
            as: 'user',
        });
        AssociationHelpers.hasMany(User, Me, {
            foreignKey: 'userId',
            as: 'payments',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            userId: DataTypes.UUID,
            isDefault: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            ...ContentAttributes(),
        }
    },
}
