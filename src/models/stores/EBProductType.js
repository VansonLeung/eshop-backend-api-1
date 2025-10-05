import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    CodeAttributes,
    ContentAssociations,
    ContentAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
    ParentChildAssociations,
    ParentChildAttributes,
} from 'sequelize-rest-framework';

export const EBProductType = {
    makeAssociations: ({Me, Lang}) => {
        CodeAttributes();
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

