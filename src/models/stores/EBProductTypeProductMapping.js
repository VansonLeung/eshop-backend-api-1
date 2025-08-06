import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl";

export const EBProductTypeProductMapping = {
    makeAssociations: ({Me, ProductType, Product}) => {
        ProductType.belongsToMany(Product, { 
            through: Me,
            as: 'products',
            foreignKey: 'productTypeId',
            constraints: Settings.constraints,
        });
        Product.belongsToMany(ProductType, { 
            through: Me,
            as: 'productTypes',
            foreignKey: 'productId',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            productTypeId: DataTypes.UUID,
            productId: DataTypes.UUID,
        }
    },
}
