import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBShopOwnerMapping = {
    makeAssociations: ({Me, Shop, User}) => {
        AssociationHelpers.belongsToMany(Shop, User, { 
            through: Me,
            as: 'users',
            foreignKey: 'shopId',
        });
        AssociationHelpers.belongsToMany(User, Shop, { 
            through: Me,
            as: 'shops',
            foreignKey: 'userId',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            shopId: DataTypes.UUID,
            userId: DataTypes.UUID,
        }
    },
}
