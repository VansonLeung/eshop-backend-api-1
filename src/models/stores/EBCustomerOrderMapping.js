import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes, 
} from 'sequelize-rest-framework';

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
