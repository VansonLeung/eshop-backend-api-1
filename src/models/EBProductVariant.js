import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";
import { ContentAssociations } from "./_incl/ContentAssociations.js";
import { ProductVariantAttributes } from "./_incl/ProductVariantAttributes.js";
import { Settings } from "./_settings/Settings.js";

export const EBProductVariant = {
    makeAssociations: ({Me, Lang, Product}) => {
        ContentAssociations({ Me, Lang });

        Me.belongsTo(Product, {
            as: 'product',
            foreignKey: 'productId',
            constraints: Settings.constraints,
        });
        Product.hasMany(Me, {
            as: 'variants',
            foreignKey: 'productId',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            productId: { type: DataTypes.UUID, index: true },
            ...ContentAttributes(),
            ...ProductVariantAttributes(),
        }
    },
};

