import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes, 
    CodeAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes,
} from "../_incl";

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

