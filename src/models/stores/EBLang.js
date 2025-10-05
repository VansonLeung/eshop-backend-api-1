import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes, 
    CodeAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes,
} from 'sequelize-rest-framework';

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

