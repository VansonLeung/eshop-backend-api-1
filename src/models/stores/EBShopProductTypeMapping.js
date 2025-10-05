import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

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
