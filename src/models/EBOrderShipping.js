import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { ProductAttributes } from "./_incl/ProductAttributes.js";
import { OrderItemAttributes } from "./_incl/OrderItemAttribtes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";
import { ContactAttributes } from "./_incl/ContactAttributes.js";

export const EBOrderShipping = {
    makeAssociations: ({Me, Order}) => {
        Me.belongsTo(Order, {
            foreignKey: 'orderId',
            as: 'order',
            constraints: Settings.constraints,
        });
        Order.hasMany(Me, {
            foreignKey: 'orderId',
            as: 'orderShippings',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            orderId: DataTypes.UUID,
            ...ContactAttributes(),
        }
    },
};

