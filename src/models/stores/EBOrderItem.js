import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicSeqIdlessAttributes, 
    OrderItemAttributes, 
    ParentChildAssociations, 
    ParentChildAttributes,
} from "../_incl/index.js";

export const EBOrderItem = {
    makeAssociations: ({Me, Order, Product, ProductVariant}) => {
        AssociationHelpers.belongsTo(Me, Order, {
            foreignKey: 'orderId',
            as: 'order',
        });
        AssociationHelpers.hasMany(Order, Me, {
            foreignKey: 'orderId',
            as: 'orderItems',
        });

        AssociationHelpers.belongsTo(Me, Product, {
            foreignKey: 'productId',
            as: 'product',
        });
        AssociationHelpers.hasMany(Product, Me, {
            foreignKey: 'productId',
            as: 'orderItems',
        });

        AssociationHelpers.belongsTo(Me, ProductVariant, {
            foreignKey: 'productVariantId',
            as: 'productVariant',
        });
        AssociationHelpers.hasMany(ProductVariant, Me, {
            foreignKey: 'productVariantId',
            as: 'orderItems',
        });

        ParentChildAssociations({ Me });
    },

    makeSchema: () => {
        return {
            ...BasicSeqIdlessAttributes(),
            orderId: {
                type: DataTypes.UUID,
                index: true,
            },
            productId: {
                type: DataTypes.UUID,
                index: true,
            },
            productVariantId: {
                type: DataTypes.UUID,
                index: true,
            },
            ...OrderItemAttributes(),
            ...ParentChildAttributes(),
        }
    },
};

