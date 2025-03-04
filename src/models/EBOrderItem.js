import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { OrderItemAttributes } from "./_incl/OrderItemAttribtes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

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
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            ...ContentAttributes(),
            orderId: DataTypes.UUID,
            productId: DataTypes.UUID,
            productVariantId: DataTypes.UUID,
            ...OrderItemAttributes(),
        }
    },
};

