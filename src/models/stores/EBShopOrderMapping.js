import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl";

export const EBShopOrderMapping = {
    makeAssociations: ({Me, Shop, Order}) => {
        Shop.belongsToMany(Order, { 
            through: Me,
            as: 'orders',
            foreignKey: 'shopId',
            constraints: Settings.constraints,
        });
        Order.belongsToMany(Shop, { 
            through: Me,
            as: 'shops',
            foreignKey: 'orderId',
            constraints: Settings.constraints,
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
