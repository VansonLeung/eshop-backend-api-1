import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from "../../../packages/sequelize-rest-framework/src/index.js";
import { 
    BasicAttributes, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes,
} from "../_incl/index.js";

export const EBProductVariableFieldValue = {
    makeAssociations: ({Me, ProductVariableField}) => {
        AssociationHelpers.belongsTo(Me, ProductVariableField, {
            foreignKey: 'productVariableFieldId',
            as: 'productVariableField',
        });
        AssociationHelpers.hasMany(ProductVariableField, Me, {
            foreignKey: 'productVariableFieldId',
            as: 'productVariableFieldValues',
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

