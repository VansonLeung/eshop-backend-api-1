import Sequelize, { DataTypes } from "sequelize"
import { BasicAttributes } from "./_incl/BasicAttributes.js"
import { DatedStatusAttributes } from "./_incl/DatedStatusAttributes.js";
import { ContactAttributes } from "./_incl/ContactAttributes.js";
import { ContentAttributes } from "./_incl/ContentAttributes.js";
import { Settings } from "./_settings/Settings.js";
import { DatedSoftDeleteStatusAttributes } from "./_incl/DatedSoftDeleteStatusAttributes.js";

export const EBUserStatus = {
    makeAssociations: ({Me, User}) => {
        Me.belongsTo(User, {
            foreignKey: 'userId',
            as: 'user',
            constraints: Settings.constraints,
        });
        User.hasMany(Me, {
            foreignKey: 'userId',
            as: 'statuses',
            constraints: Settings.constraints,
        });
    },

    makeSchema: () => {
        return {
            ...BasicAttributes(),
            ...DatedStatusAttributes(),
            ...DatedSoftDeleteStatusAttributes(),
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            ...ContentAttributes(),
        }
    },
}
