import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl/index.js";

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
