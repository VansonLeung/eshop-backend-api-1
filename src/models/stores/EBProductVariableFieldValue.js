import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

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

