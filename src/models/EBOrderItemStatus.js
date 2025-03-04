import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { ProductAttributes } from "./_incl/ProductAttributes.js";
import { OrderItemAttributes } from "./_incl/OrderItemAttribtes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";
import { ContactAttributes } from "./_incl/ContactAttributes.js";

export const EBOrderItemStatus = {
    makeAssociations: ({Me, OrderItem}) => {
        Me.belongsTo(OrderItem, {
            foreignKey: 'orderItemId',
            as: 'orderItem',
            constraints: Settings.constraints,
        });
        OrderItem.hasMany(Me, {
            foreignKey: 'orderItemId',
            as: 'orderItemStatuses',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            orderItemId: DataTypes.UUID,
            ...ContentAttributes(),
        }
    },
};

