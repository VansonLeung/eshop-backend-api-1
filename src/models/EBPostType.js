import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";
import { ParentChildAttributes } from "./_incl/ParentChildAttributes.js";
import { ParentChildAssociations } from "./_incl/ParentChildAssociations.js";
import { ContentAssociations } from "./_incl/ContentAssociations.js";

export const EBPostType = {
    makeAssociations: ({Me, Lang}) => {
        ContentAssociations({ Me, Lang });
        ParentChildAssociations({ Me });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            ...ContentAttributes(),
            ...ParentChildAttributes(),
        }
    },
};

