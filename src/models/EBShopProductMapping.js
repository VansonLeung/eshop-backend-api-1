import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js";
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBShopProductMapping = {
    makeAssociations: ({Me, Shop, Product}) => {
        Shop.belongsToMany(Product, { 
            through: Me,
            as: 'products',
            foreignKey: 'shopId',
            constraints: Settings.constraints,
        });
        Product.belongsToMany(Shop, { 
            through: Me,
            as: 'shops',
            foreignKey: 'productId',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            shopId: DataTypes.UUID,
            productId: DataTypes.UUID,
        }
    },
}
