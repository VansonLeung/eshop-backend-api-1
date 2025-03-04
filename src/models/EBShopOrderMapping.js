import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js";
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

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
