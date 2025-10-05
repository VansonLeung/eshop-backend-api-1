import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl/index.js";

export const EBProductTypeProductMapping = {
    makeAssociations: ({Me, ProductType, Product}) => {
        AssociationHelpers.belongsToMany(ProductType, Product, { 
            through: Me,
            as: 'products',
            foreignKey: 'productTypeId',
        });
        AssociationHelpers.belongsToMany(Product, ProductType, { 
            through: Me,
            as: 'productTypes',
            foreignKey: 'productId',
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
