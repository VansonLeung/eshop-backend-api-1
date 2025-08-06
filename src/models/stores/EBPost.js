import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes, 
    ContentAssociations, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes,
} from "../_incl";

export const EBPost = {
    makeAssociations: ({Me, Lang}) => {
        ContentAssociations({ Me, Lang });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            ...ContentAttributes(),
        }
    },
};

