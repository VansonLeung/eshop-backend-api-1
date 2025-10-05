import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
    OrderItemAttributes,
} from "../_incl/index.js";

export const EBUserCartItem = {
    makeAssociations: ({Me, User, Product}) => {
        AssociationHelpers.belongsTo(Me, User, {
            foreignKey: 'userId',
            as: 'user',
        });
        AssociationHelpers.hasMany(User, Me, {
            foreignKey: 'userId',
            as: 'cartItems',
        });

        AssociationHelpers.belongsTo(Me, Product, {
            foreignKey: 'productId',
            as: 'product',
        });
        AssociationHelpers.hasMany(Product, Me, {
            foreignKey: 'productId',
            as: 'cartItems',
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            userId: DataTypes.UUID,
            productId: DataTypes.UUID,
            ...OrderItemAttributes(),
        }
    },
}
