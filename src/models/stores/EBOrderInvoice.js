import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    ContentAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBOrderInvoice = {
    makeAssociations: ({Me, Order}) => {
        AssociationHelpers.belongsTo(Me, Order, {
            foreignKey: 'orderId',
            as: 'order',
        });
        AssociationHelpers.hasMany(Order, Me, {
            foreignKey: 'orderId',
            as: 'orderInvoices',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            orderId: DataTypes.UUID,
            ...ContentAttributes(),
        }
    },
};

