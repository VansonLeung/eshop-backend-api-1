import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl/index.js";

export const EBShopProductTypeMapping = {
    makeAssociations: ({Me, Shop, ProductType}) => {
        AssociationHelpers.belongsToMany(Shop, ProductType, { 
            through: Me,
            as: 'productTypes',
            foreignKey: 'shopId',
        });
        AssociationHelpers.belongsToMany(ProductType, Shop, { 
            through: Me,
            as: 'shops',
            foreignKey: 'productTypeId',
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
