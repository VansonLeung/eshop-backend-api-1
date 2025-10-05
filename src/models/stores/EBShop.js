import Sequelize, { DataTypes } from "sequelize"
import { 
    BasicAttributes,
    ContentAssociations,
    ContentAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBShop = {
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

