import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBProductVariableField = {
    makeAssociations: ({Me, Product}) => {
        AssociationHelpers.belongsTo(Me, Product, {
            foreignKey: 'productId',
            as: 'product',
        });
        AssociationHelpers.hasMany(Product, Me, {
            foreignKey: 'productId',
            as: 'productVariableFields',
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

