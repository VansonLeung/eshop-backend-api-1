import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes, 
    ContactAttributes, 
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBOrderBilling = {
    makeAssociations: ({Me, Order}) => {
        AssociationHelpers.belongsTo(Me, Order, {
            foreignKey: 'orderId',
            as: 'order',
        });
        AssociationHelpers.hasMany(Order, Me, {
            foreignKey: 'orderId',
            as: 'orderCustomerBillings',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            orderId: DataTypes.UUID,
            ...ContactAttributes(),
        }
    },
};

