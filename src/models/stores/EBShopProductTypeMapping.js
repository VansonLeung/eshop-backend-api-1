import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl";

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
