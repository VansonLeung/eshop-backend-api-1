import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js";
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBShopProductTypeMapping = {
    makeAssociations: ({Me, Shop, ProductType}) => {
        Shop.belongsToMany(ProductType, { 
            through: Me,
            as: 'productTypes',
            foreignKey: 'shopId',
            constraints: Settings.constraints,
        });
        ProductType.belongsToMany(Shop, { 
            through: Me,
            as: 'shops',
            foreignKey: 'productTypeId',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            shopId: DataTypes.UUID,
            productTypeId: DataTypes.UUID,
        }
    },
}
