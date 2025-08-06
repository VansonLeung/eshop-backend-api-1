import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
    OrderAttributes,
} from "../_incl";

export const EBOrder = {
    makeAssociations: ({Me, }) => {

    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            ...OrderAttributes(),
            customerId: DataTypes.UUID,
        }
    },
};

