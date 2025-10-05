import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes, 
} from "../_incl/index.js";

export const EBCustomerOrderMapping = {
    makeAssociations: ({Me, Customer, Order}) => {
        AssociationHelpers.belongsToMany(Customer, Order, { 
            through: Me,
            as: 'orders',
            foreignKey: 'customerId',
        });
        AssociationHelpers.belongsToMany(Order, Customer, { 
            through: Me,
            as: 'customers',
            foreignKey: 'orderId',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            customerId: DataTypes.UUID,
            orderId: DataTypes.UUID,
        }
    },
}
