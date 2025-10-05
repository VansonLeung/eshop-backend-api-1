import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicSeqIdlessAttributes, 
    ContentAttributes, 
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBOrderItemStatus = {
    makeAssociations: ({Me, OrderItem}) => {
        AssociationHelpers.belongsTo(Me, OrderItem, {
            foreignKey: 'orderItemId',
            as: 'orderItem',
        });
        AssociationHelpers.hasMany(OrderItem, Me, {
            foreignKey: 'orderItemId',
            as: 'orderItemStatuses',
        });
    },

    makeSchema: () => {
        return {
            ...BasicSeqIdlessAttributes(),
            ...DatedStatusAttributes(),
            orderItemId: DataTypes.UUID,
            ...ContentAttributes(),
        }
    },
};

