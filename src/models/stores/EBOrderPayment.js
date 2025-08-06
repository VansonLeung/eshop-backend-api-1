import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes,
} from "../_incl";

export const EBOrderPayment = {
    makeAssociations: ({Me, Order}) => {
        Me.belongsTo(Order, {
            foreignKey: 'orderId',
            as: 'order',
            constraints: Settings.constraints,
        });
        Order.hasMany(Me, {
            foreignKey: 'orderId',
            as: 'orderPayments',
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

