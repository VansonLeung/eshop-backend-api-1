import Sequelize, { DataTypes } from "sequelize"
import { AssociationHelpers } from 'sequelize-rest-framework';
import { 
    BasicAttributes, 
    CodeAttributes, 
    ContentAssociations, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes, 
    ProductVariantAssociations, 
    ProductVariantAttributes,
} from 'sequelize-rest-framework';

export const EBProductVariant = {
    makeAssociations: ({Me, Lang, Product}) => {
        CodeAttributes();
        ContentAssociations({ Me, Lang });
        ProductVariantAssociations({ Me, Product, });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            ...ContentAttributes(),
            ...ProductVariantAttributes(),
        }
    },
};

