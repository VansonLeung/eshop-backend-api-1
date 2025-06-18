import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { OrderItemAttributes } from "./_incl/OrderItemAttribtes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";
import { ParentChildAssociations } from "./_incl/ParentChildAssociations.js";
import { ParentChildAttributes } from "./_incl/ParentChildAttributes.js";
import { BasicSeqIdlessAttributes } from "./_incl/BasicSeqIdLessAttributes.js";

export const EBOrderItem = {
    makeAssociations: ({Me, Order, Product, ProductVariant}) => {
        Me.belongsTo(Order, {
            foreignKey: 'orderId',
            as: 'order',
            constraints: Settings.constraints,
        });
        Order.hasMany(Me, {
            foreignKey: 'orderId',
            as: 'orderItems',
            constraints: Settings.constraints,
        });

        Me.belongsTo(Product, {
            foreignKey: 'productId',
            as: 'product',
            constraints: Settings.constraints,
        });
        Product.hasMany(Me, {
            foreignKey: 'productId',
            as: 'orderItems',
            constraints: Settings.constraints,
        });

        Me.belongsTo(ProductVariant, {
            foreignKey: 'productVariantId',
            as: 'productVariant',
            constraints: Settings.constraints,
        });
        ProductVariant.hasMany(Me, {
            foreignKey: 'productVariantId',
            as: 'orderItems',
            constraints: Settings.constraints,
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

