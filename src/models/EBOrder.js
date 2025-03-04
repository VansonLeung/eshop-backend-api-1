import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { ProductAttributes } from "./_incl/ProductAttributes.js";
import { OrderItemAttributes } from "./_incl/OrderItemAttribtes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBOrder = {
    makeAssociations: ({Me, }) => {

    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            ...ContentAttributes(),
            customerId: DataTypes.UUID,
        }
    },
};

