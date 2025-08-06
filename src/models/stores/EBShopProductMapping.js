import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl";

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
