import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBOrderStatus = {
    makeAssociations: ({Me, Order}) => {
        Me.belongsTo(Order, {
            foreignKey: 'orderId',
            as: 'order',
            constraints: Settings.constraints,
        });
        Order.hasMany(Me, {
            foreignKey: 'orderId',
            as: 'orderStatuses',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            orderId: DataTypes.UUID,
            ...ContentAttributes(),
        }
    },
};

