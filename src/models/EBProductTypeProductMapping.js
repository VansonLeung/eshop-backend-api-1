import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js";
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

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
            ...DatedSoftDeleteStatusAttributes(),
            productTypeId: DataTypes.UUID,
            productId: DataTypes.UUID,
        }
    },
}
