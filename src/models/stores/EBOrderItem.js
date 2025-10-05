import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicSeqIdlessAttributes, 
    OrderItemAttributes, 
    ParentChildAssociations, 
    ParentChildAttributes,
} from 'sequelize-rest-framework';

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

