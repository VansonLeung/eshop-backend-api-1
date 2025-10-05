import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    ContentAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBUserStatus = {
    makeAssociations: ({Me, User}) => {
        AssociationHelpers.belongsTo(Me, User, {
            foreignKey: 'userId',
            as: 'user',
        });
        AssociationHelpers.hasMany(User, Me, {
            foreignKey: 'userId',
            as: 'statuses',
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
            ...ContentAttributes(),
        }
    },
}
