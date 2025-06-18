import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";
import { BasicSeqIdlessAttributes } from "./_incl/BasicSeqIdLessAttributes.js";

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
            ...BasicSeqIdlessAttributes(),
            ...DatedStatusAttributes(),
            orderItemId: DataTypes.UUID,
            ...ContentAttributes(),
        }
    },
};

