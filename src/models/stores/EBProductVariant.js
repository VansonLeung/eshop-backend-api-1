import Sequelize, { DataTypes } from "sequelize"
import { Settings } from "../_settings";
import { 
    BasicAttributes, 
    CodeAttributes, 
    ContentAssociations, 
    ContentAttributes, 
    DatedSoftDeleteStatusAttributes, 
    DatedStatusAttributes, 
    ProductVariantAssociations, 
    ProductVariantAttributes,
} from "../_incl";

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

