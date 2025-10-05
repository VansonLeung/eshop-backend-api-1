import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import {
    BasicAttributes,
    ContactAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
 } from 'sequelize-rest-framework';

export const EBUserBilling = {
    makeAssociations: ({Me, User}) => {
        AssociationHelpers.belongsTo(Me, User, {
            foreignKey: 'userId',
            as: 'user',
        });
        AssociationHelpers.hasMany(User, Me, {
            foreignKey: 'userId',
            as: 'billings',
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
            ...ContactAttributes(),
        }
    },
}
