import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from "../_incl/index.js";

export const EBProductVariantVarMapping = {
    makeAssociations: ({Me, ProductVariant, ProductVariableFieldValue}) => {
        AssociationHelpers.belongsToMany(ProductVariant, ProductVariableFieldValue, { 
            through: Me,
            as: 'variableFieldValues',
            foreignKey: 'variantId',
        });
        AssociationHelpers.belongsToMany(ProductVariableFieldValue, ProductVariant, { 
            through: Me,
            as: 'variants',
            foreignKey: 'variableFieldValueId',
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
