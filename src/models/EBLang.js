import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { CodeAttributes } from "./_incl/CodeAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBLang = {
    makeAssociations: ({Me}) => {

    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...CodeAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
        }
    },
};

