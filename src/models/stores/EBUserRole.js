import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
} from "../_incl";

export const EBUserRole = {
    makeAssociations: ({Me}) => {

    },
    
    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            code: {
                type: DataTypes.STRING(64),
                allowNull: false,
                unique: false,
            },
        }
    },
};

