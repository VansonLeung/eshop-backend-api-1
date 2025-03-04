import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBProductVariableFieldValue = {
    makeAssociations: ({Me, ProductVariableField}) => {
        Me.belongsTo(ProductVariableField, {
            foreignKey: 'productVariableFieldId',
            as: 'productVariableField',
            constraints: Settings.constraints,
        });
        ProductVariableField.hasMany(Me, {
            foreignKey: 'productVariableFieldId',
            as: 'productVariableFieldValues',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            productVariableFieldId: {type: DataTypes.UUID, index: true, },
            ...ContentAttributes(),
        }
    },
};

