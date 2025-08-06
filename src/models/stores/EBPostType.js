import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes, 
    ContentAssociations, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes, 
    ParentChildAssociations, 
    ParentChildAttributes,
} from "../_incl";

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

