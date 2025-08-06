import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes,
} from "../_incl";

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

