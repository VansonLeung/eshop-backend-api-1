import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js";
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBCustomerOrderMapping = {
    makeAssociations: ({Me, Customer, Order}) => {
        Customer.belongsToMany(Order, { 
            through: Me,
            as: 'orders',
            foreignKey: 'customerId',
            constraints: Settings.constraints,
        });
        Order.belongsToMany(Customer, { 
            through: Me,
            as: 'customers',
            foreignKey: 'orderId',
            constraints: Settings.constraints,
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
