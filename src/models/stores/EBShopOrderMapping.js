import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl/index.js";

export const EBShopOrderMapping = {
    makeAssociations: ({Me, Shop, Order}) => {
        AssociationHelpers.belongsToMany(Shop, Order, { 
            through: Me,
            as: 'orders',
            foreignKey: 'shopId',
        });
        AssociationHelpers.belongsToMany(Order, Shop, { 
            through: Me,
            as: 'shops',
            foreignKey: 'orderId',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            shopId: DataTypes.UUID,
            orderId: DataTypes.UUID,
        }
    },
}
