import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicSeqIdlessAttributes, 
    ContentAttributes, 
    DatedStatusAttributes,
} from "../_incl/index.js";

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

