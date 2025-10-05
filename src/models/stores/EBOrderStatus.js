import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBOrderStatus = {
    makeAssociations: ({Me, Order}) => {
        AssociationHelpers.belongsTo(Me, Order, {
            foreignKey: 'orderId',
            as: 'order',
        });
        AssociationHelpers.hasMany(Order, Me, {
            foreignKey: 'orderId',
            as: 'orderStatuses',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            orderId: DataTypes.UUID,
            ...ContentAttributes(),
        }
    },
};

