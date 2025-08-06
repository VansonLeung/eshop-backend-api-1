import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl";

export const EBProductVariantVarMapping = {
    makeAssociations: ({Me, ProductVariant, ProductVariableFieldValue}) => {
        ProductVariant.belongsToMany(ProductVariableFieldValue, { 
            through: Me,
            as: 'variableFieldValues',
            foreignKey: 'variantId',
            constraints: Settings.constraints,
        });
        ProductVariableFieldValue.belongsToMany(ProductVariant, { 
            through: Me,
            as: 'variants',
            foreignKey: 'variableFieldValueId',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            variantId: DataTypes.UUID,
            variableFieldValueId: DataTypes.UUID,
        }
    },
}
