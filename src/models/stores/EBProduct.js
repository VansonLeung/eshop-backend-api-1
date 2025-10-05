import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes,
    CodeAttributes,
    ContentAssociations,
    ContentAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

export const EBProduct = {
    makeAssociations: ({Me, Lang}) => {
        CodeAttributes();
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

