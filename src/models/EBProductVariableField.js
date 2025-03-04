import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBProductVariableField = {
    makeAssociations: ({Me, Product}) => {
        Me.belongsTo(Product, {
            foreignKey: 'productId',
            as: 'product',
            constraints: Settings.constraints,
        });
        Product.hasMany(Me, {
            foreignKey: 'productId',
            as: 'productVariableFields',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            productId: {type: DataTypes.UUID, index: true, },
            ...ContentAttributes(),
        }
    },
};

