import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBShopProductMapping = {
    makeAssociations: ({Me, Shop, Product}) => {
        AssociationHelpers.belongsToMany(Shop, Product, { 
            through: Me,
            as: 'products',
            foreignKey: 'shopId',
        });
        AssociationHelpers.belongsToMany(Product, Shop, { 
            through: Me,
            as: 'shops',
            foreignKey: 'productId',
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
