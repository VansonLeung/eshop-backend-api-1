import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes,
    DatedSoftDeleteStatusAttributes,
    DatedStatusAttributes,
    OrderAttributes,
} from 'sequelize-rest-framework';

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

