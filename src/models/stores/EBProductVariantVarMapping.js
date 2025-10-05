import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

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
