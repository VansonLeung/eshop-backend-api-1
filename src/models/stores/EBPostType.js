import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes, 
    ContentAssociations, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes, 
    ParentChildAssociations, 
    ParentChildAttributes,
} from 'sequelize-rest-framework';

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

