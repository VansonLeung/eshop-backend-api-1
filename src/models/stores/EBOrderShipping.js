import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    ContactAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBOrderShipping = {
    makeAssociations: ({Me, Order}) => {
        AssociationHelpers.belongsTo(Me, Order, {
            foreignKey: 'orderId',
            as: 'order',
        });
        AssociationHelpers.hasMany(Order, Me, {
            foreignKey: 'orderId',
            as: 'orderShippings',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            orderId: DataTypes.UUID,
            ...ContactAttributes(),
        }
    },
};

