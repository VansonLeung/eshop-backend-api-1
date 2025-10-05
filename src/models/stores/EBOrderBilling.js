import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicAttributes, 
    ContactAttributes, 
    DatedStatusAttributes,
} from "../_incl/index.js";

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

