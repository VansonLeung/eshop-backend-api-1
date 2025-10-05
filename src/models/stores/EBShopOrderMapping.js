import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBShopOrderMapping = {
    makeAssociations: ({Me, Shop, Order}) => {
        AssociationHelpers.belongsToMany(Shop, Order, { 
            through: Me,
            as: 'orders',
            foreignKey: 'shopId',
        });
        AssociationHelpers.belongsToMany(Order, Shop, { 
            through: Me,
            as: 'shops',
            foreignKey: 'orderId',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            shopId: DataTypes.UUID,
            orderId: DataTypes.UUID,
        }
    },
}
