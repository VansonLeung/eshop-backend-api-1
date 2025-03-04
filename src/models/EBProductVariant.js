import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";
import { ContentAssociations } from "./_incl/ContentAssociations.js";
import { ProductVariantAttributes } from "./_incl/ProductVariantAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { ProductVariantAssociations } from "./_incl/ProductVariantAssociations.js";

export const EBProductVariant = {
    makeAssociations: ({Me, Lang, Product}) => {
        ContentAssociations({ Me, Lang });
        ProductVariantAssociations({ Me, Product, })
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            ...ContentAttributes(),
            ...ProductVariantAttributes(),
        }
    },
};

