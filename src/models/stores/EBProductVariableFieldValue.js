import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes,
} from "../_incl";

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

