import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { ProductAttributes } from "./_incl/ProductAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";
import { ProductVariableAttributes } from "./_incl/ProductVariableAttributes.js";
import { ContentAssociations } from "./_incl/ContentAssociations.js";

export const EBProduct = {
    makeAssociations: ({Me, Lang}) => {
        ContentAssociations({ Me, Lang });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            ...ContentAttributes(),
            ...ProductAttributes(),
            ...ProductVariableAttributes(),
        }
    },
};

