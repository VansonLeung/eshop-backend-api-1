import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

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
